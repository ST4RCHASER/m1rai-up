import { createDropzone } from '@solid-primitives/upload';
import { For, createSignal } from 'solid-js';
import axios from 'axios';
import { UploadCard, miraiHistory, miraiValue } from './uploadcard.component';
import createLocalStore from '@solid-primitives/local-store';
import Arrow from './Arrow';

export const Upload = () => {
  const [value, setValue] = createLocalStore('m1rai');
  const [isDraging, setIsDraging] = createSignal(false);
  const [processCard, setProcessCard] = createSignal([]);
  const [finishedCard, setFinishedCard] = createSignal(
    JSON.parse((value as any).history || '[]'),
  );

  const getRandomInt = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min;
  };

  const onUploadFile = (files: File[]) => {
    console.log('files', files);
    setProcessCard(processCard().concat(files as any));
  };

  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async (files) => {
      setIsDraging(false);
      onUploadFile(files.map((f) => f.file).slice(0, 5));
    },
    onDragEnter: () => {
      setIsDraging(true);
    },
    onDragLeave: () => {
      setIsDraging(false);
    },
  });

  return (
    <>
      <main>
        <div
          ref={dropzoneRef}
          class={`${
            isDraging() ? 'z-40 opacity-100' : 'z-30 opacity-0'
          } duration-200 w-screen h-screen fixed flex items-center justify-center bg-black bg-opacity-80`}
        >
          <h1 class="text-6xl text-white font-bold">Drag here to upload</h1>
          <input
            type="file"
            title="Click to pick and upload"
            onChange={(e: any) => onUploadFile(Array.from(e.target.files))}
            class="absolute w-full h-full opacity-0"
          />
        </div>
        <div class="absolute top-0 text-white p-6 w-full">
          <div class="text-6xl font-bold italic w-fit">
            M1RAI
            <span class="ml-2 text-sm font-normal">(up.mir.ai)</span>
          </div>
          <div class="text-lg p-4">
            <p>Welcome to m1rai up</p>
            <p>Drag 'and drop or click empty area to upload</p>
            <p>Up to 100MB is allowed</p>
          </div>
          <div class="px-4 py-2">
            {(value as miraiValue)?.history &&
              JSON.parse((value as any)?.history)?.length > 0 &&
              'History'}
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] p-2 gap-3">
            <For each={processCard().reverse()}>
              {(data, i) => (
                <UploadCard file={data} preData={null} isUploaded={false} />
              )}
            </For>
            <For each={finishedCard().reverse()}>
              {(data: miraiHistory, i) => (
                <UploadCard file={null} preData={data} isUploaded={true} />
              )}
            </For>
          </div>
        </div>
      </main>
      <div class="w-screen h-screen fixed bg-black bg-gradient-to-t from-[#02712d] via-[#033a1a] to-[#030a0c] overflow-hidden -z-40">
        <div class="arrows w-full h-full relative -bottom-3/4">
          <For each={Array(24).fill(Math.random)}>
            {() => (
              <div class="relative">
                <div
                  class={`absolute`}
                  style={{
                    width: `${getRandomInt(56, 128)}px`,
                    'animation-duration': `${getRandomInt(4000, 6000)}ms`,
                    bottom: `-${getRandomInt(350, 550)}px`,
                    'animation-delay': `${getRandomInt(10, 5000)}ms`,
                    'margin-left': `${getRandomInt(0, 100)}%`,
                  }}
                >
                  {<Arrow color="#FFFFFF" />}
                </div>
              </div>
            )}
          </For>
        </div>
        <div class="dots w-screen h-1/2 absolute -bottom-1/2">
          <For each={Array(100).fill(Math.random)}>
            {() => (
              <div class="relative">
                <div
                  class={`absolute z-40 bg-white rounded-full`}
                  style={{
                    width: `2px`,
                    height: `2px`,
                    'animation-duration': `${getRandomInt(4000, 6000)}ms`,
                    'animation-delay': `${getRandomInt(1, 6000)}ms`,
                    'margin-left': `${getRandomInt(0, 100)}%`,
                  }}
                />
              </div>
            )}
          </For>
        </div>
        <div class="absolute h-3/4 w-screen big-arrow bottom-0">
          {<Arrow color="#001707" />}
        </div>
      </div>
    </>
  );
};
