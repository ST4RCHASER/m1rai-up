import { createEffect, createSignal } from 'solid-js';
import axios from 'axios';
import { humanFileSize } from '../libs/utils';
import createLocalStore from '@solid-primitives/local-store';

export interface miraiHistory {
  name: string;
  url: string;
  size: number;
  date: Date;
}
export interface miraiValue {
  history: miraiHistory[];
}

export const UploadCard = ({
  file,
  isUploaded,
  preData,
}: {
  file: File | null;
  isUploaded: boolean;
  preData: miraiHistory | null;
}) => {
  const [copyState, setCopyState] = createSignal(false);
  const [progess, setProgress] = createSignal(0);
  const [progessData, setProgressData] = createSignal('0/0');
  const [errorMessage, setErrorMessage] = createSignal('');
  const [isOK, setIsOK] = createSignal(isUploaded);
  const [showCompleteText, setShowCompleteText] = createSignal(false);
  const [value, setValue] = createLocalStore('m1rai');
  const [isMultiPartUpload, setIsMultiPartUpload] = createSignal(false)
  if (!(value as any)?.history) setValue('history', JSON.stringify([]));
  const [displayData, setDisplayData] = createSignal(
    preData || {
      name: 'Unknown file name',
      url: '',
      size: 0,
      date: new Date(),
    },
  );
  const UPLOAD_ENDPOINT = 'https://up.m1r.ai/upload';
  const LIMIT_SIZE_CF = 50 * 1024 * 1024
  const DEFAULT_LIMIT_SIZE = 104857600
  let timer: NodeJS.Timer;

  createEffect(() => {
    const LIMIT_SIZE = (window as unknown as {
      uploadLimit: number;
    }).uploadLimit
    if (file) {
      if (LIMIT_SIZE > DEFAULT_LIMIT_SIZE) {
        setIsMultiPartUpload(true)
      }
      if (file.size >= LIMIT_SIZE) {
        setErrorMessage(`This file size is over ${humanFileSize(LIMIT_SIZE)}`);
        return;
      }
      if (!isMultiPartUpload()) {
        const bodyFormData = new FormData();
        bodyFormData.append('uploadType', '0');
        bodyFormData.append('file', file);
        axios
          .request({
            method: 'post',
            url: UPLOAD_ENDPOINT,
            data: bodyFormData,
            onUploadProgress: (p) => {
              setProgress(Math.round((p.progress || 0) * 100));
              setProgressData(
                `${humanFileSize(p.loaded)} / ${humanFileSize(p.total || 0)}`,
              );
            },
          })
          .then((data) => {
            setProgress(0);
            setIsOK(true);
            const res = {
              name: file.name,
              url: data.data.url,
              size: file.size,
              date: displayData().date,
            };
            setDisplayData(res);

            // Add to history
            const newArray = JSON.parse((value as any).history);
            newArray.push(res);
            setValue('history', JSON.stringify(newArray));

            setShowCompleteText(true);
          })
          .catch((e) => {
            setErrorMessage(
              e?.response?.data?.message ||
              e?.response?.statusText ||
              e?.message ||
              e,
            );
            setIsOK(false);
          });
        return
      }
      //Multi part upload
      const bodyFormData = new FormData();
      bodyFormData.append('uploadType', '2');
      bodyFormData.append('mimeType', file.type)
      bodyFormData.append('fileName', file.name)
      bodyFormData.append('size', file.size.toString())
      axios.request({
        url: UPLOAD_ENDPOINT,
        method: 'POST',
        data: bodyFormData
      }).then(async ({ data }) => {
        const maxPerPart = LIMIT_SIZE_CF
        const totalPart = Math.ceil(file.size / maxPerPart)
        const partArray = []
        for (let i = 0; i < totalPart; i++) {
          partArray.push(file.slice(i * maxPerPart, (i + 1) * maxPerPart))
        }
        console.log('partOfArray', partArray)
        // for (const [index, part] of partArray.entries()) {
        //   const res = await axios.request({
        //     method: 'PUT',
        //     url: UPLOAD_ENDPOINT,
        //     data: part,
        //     onUploadProgress: (p) => {
        //       console.log('part' + index, p);
        //     },
        //     headers: {
        //       'x-upload-token': data.info.uploadToken,
        //       'x-upload-part': index.toString()
        //     }
        //   })
        //   console.log('res', res)
        // }
        const uploadProgress = []
        const uploadPromises = partArray.map(async (part, index) => {
          return await axios.request({
            method: 'PUT',
            url: UPLOAD_ENDPOINT,
            data: part,
            onUploadProgress: (p) => {
              console.log('part' + index, p);
              uploadProgress[index] = p
            },
            headers: {
              'x-upload-token': data.info.uploadToken,
              'x-upload-part': index.toString()
            }
          })
        }
        )
        timer = setInterval(() => {
          const reject = uploadProgress.find(p => p.status === 'rejected')
          if (reject) {
            clearInterval(timer)
            setErrorMessage(reject?.response?.data?.message ||
              reject?.response?.statusText ||
              reject?.message ||
              reject)
            return
          }
          const loaded = uploadProgress.reduce((acc, cur) => acc + cur.loaded, 0)
          const total = uploadProgress.reduce((acc, cur) => acc + cur.total, 0)
          setProgress(Math.round((loaded / total) * 100));
          setProgressData(
            `${humanFileSize(loaded)} / ${humanFileSize(total || 0)}`,
          );
        })
        await Promise.all(uploadPromises)
        console.log('finished', uploadPromises)
      }).catch((e) => {
        if (timer) {
          clearInterval(timer)
        }
        setErrorMessage(
          e?.response?.data?.message ||
          e?.response?.statusText ||
          e?.message ||
          e,
        );
        setIsOK(false);
      })

    }
  }, []);

  return (
    <div class="border rounded border-[#8ac5ac] cursor-pointer relative">
      {showCompleteText() && (
        <div class="fixed -z-10 right-6 bottom-4 text-6xl opacity-0 text-white upload-text">
          UPLOAD COMPLETE
        </div>
      )}
      {isOK() && (
        <div
          onClick={(e) => {
            clearInterval(timer);
            navigator.clipboard.writeText(displayData().url).then(() => {
              setCopyState(true);
              timer = setTimeout(() => setCopyState(false), 1500);
            });
          }}
          class={`border-2 ${copyState() ? 'copy coped' : 'copy'
            } z-30 absolute w-full h-full flex justify-center items-center text-center bg-[#040c03] bg-opacity-80 opacity-0 hover:opacity-100 duration-200 rounded font-bold text-xl text-[${copyState() ? '#0aff0a' : '#00cb00'
            }]`}
        >
          {copyState() ? 'COPIED!' : 'CLICK TO COPY'}
        </div>
      )}
      <div
        style={{
          width: `${progess()}%`,
          'background-color':
            progess() < 100
              ? 'rgba(0, 255, 0, 0.3)'
              : errorMessage()
                ? 'rgba(255, 0, 0, 0.3)'
                : 'rgba(255, 255, 0, 0.3)',
        }}
        class="h-full duration-200 transition-all absolute bg-opacity-30 -z-10"
      />
      {isOK() && displayData().name.match(/\.(jpeg|jpg|gif|png|svg)$/i) && (
        <img
          src={displayData().url}
          class="aspect-video object-cover"
          alt="Preview Image"
        />
      )}
      <div
        class={`p-3 transition-all ${isOK() &&
          displayData().name.match(/\.(jpeg|jpg|gif|png|svg)$/i) &&
          '!pt-2'
          }`}
      >
        <div class="font-bold text-ellipsis overflow-hidden w-full">
          {isOK() ? displayData().name : file?.name || displayData().name}
        </div>
        <div class="text-xs overflow-hidden text-ellipsis w-full">
          {displayData().date.toLocaleString()}
        </div>
        <div
          class={`${errorMessage() && 'text-red-500 font-bold'
            } text-xs overflow-hidden text-ellipsis w-full`}
        >
          {isOK() ? (
            humanFileSize(displayData().size)
          ) : errorMessage() ? (
            errorMessage()
          ) : (
            <span>
              {progessData()} (
              {progess() == 100 ? 'Processing...' : progess() + '%'})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
