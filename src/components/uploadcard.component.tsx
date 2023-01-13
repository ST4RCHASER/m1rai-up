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
  const [value, setValue] = createLocalStore('m1rai');
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
  let timer: NodeJS.Timer;

  createEffect(() => {
    if (file) {
      const bodyFormData = new FormData();
      bodyFormData.append('uploadType', '0');
      bodyFormData.append('file', file);
      axios
        .request({
          method: 'post',
          url: UPLOAD_ENDPOINT,
          data: bodyFormData,
          onUploadProgress: (p) => {
            console.log(p);
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
          console.log('value', value);
          const newArray = JSON.parse((value as any).history);
          newArray.push(res);
          setValue('history', JSON.stringify(newArray));
          console.log(data.data);
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
    }
  }, []);

  return (
    <div class="border rounded border-[#8ac5ac] cursor-pointer relative">
      {isOK() && (
        <div
          onClick={(e) => {
            clearInterval(timer);
            navigator.clipboard.writeText(displayData().url).then(() => {
              setCopyState(true);
              timer = setTimeout(() => setCopyState(false), 1500);
            });
          }}
          class={`border-2 ${
            copyState() ? 'copy coped' : 'copy'
          } z-30 absolute w-full h-full flex justify-center items-center text-center bg-[#040c03] bg-opacity-80 opacity-0 hover:opacity-100 duration-200 rounded font-bold text-xl text-[${
            copyState() ? '#0aff0a' : '#00cb00'
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
      ></div>
      <div class="p-4">
        <div class="font-bold text-ellipsis overflow-hidden w-full">
          {isOK() ? displayData().name : file?.name || displayData().name}
        </div>
        <div class="text-xs overflow-hidden text-ellipsis w-full">
          {displayData().date.toLocaleString()}
        </div>
        <div
          class={`${
            errorMessage() && 'text-red-500 font-bold'
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
