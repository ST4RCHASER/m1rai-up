import { createDropzone } from '@solid-primitives/upload';
import { For, createSignal } from 'solid-js';
import axios from 'axios'
import { UploadCard, miraiHistory, miraiValue } from './uploadcard.component';
import createLocalStore from '@solid-primitives/local-store';

export const Upload = () => {
  const [value, setValue] = createLocalStore('m1rai')

  function getRandomInt(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }

  const arrow = (color: string) => {
    return <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="100%" height="100%"><path style={{ fill: color }} class="a" d="m153.5 77h-44.3v79.1h-63.2v-79.1h-44.4l76-76z" /></svg>
  }

  const onUplaodFile = (files: File[]) => {
    console.log('files', files)
    setProcessCard(processCard().concat(files as any))
  }

  const [isDraging, setIsDraging] = createSignal(false)
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async files => {
      setIsDraging(false)
      onUplaodFile(files.map(f => f.file).slice(0, 5))
    },
    onDragEnter: () => {
      setIsDraging(true)
    },
    onDragLeave: () => {
      setIsDraging(false)
    },
  });


  const [finishedCard, setFinishedCard] = createSignal(JSON.parse((value as any).history || '[]'))
  const [processCard, setProcessCard] = createSignal([])
  return (
    <>
      <div>
        <div ref={dropzoneRef} class={`${isDraging() ? 'z-40 opacity-100' : 'opacity-0 z-30'} duration-200 w-screen h-screen fixed flex items-center justify-center text-white font-bold text-6xl bg-black bg-opacity-80`}>
          Drag here to upload
          <div class={`w-screen h-screen opacity-0 ${isDraging() ? '-' : ''}z-50 absolute`}>
            <input type="file" title='Click to pick and upload' onChange={(e: any) => onUplaodFile(Array.from(e.target.files))} class='w-screen h-screen' />
          </div>
        </div>
        <div class="absolute top-0 text-white p-6 z-25 w-full">
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
            {(value as miraiValue)?.history && JSON.parse((value as any)?.history)?.length > 0 && 'History'}
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(theme(width.72),1fr))] p-2 gap-3">
            <For each={processCard().reverse()}>{(data, i) =>
              <UploadCard file={data} preData={null} isUploaded={false} />
            }</For>
            <For each={finishedCard().reverse()}>{(data: miraiHistory, i) =>
              <UploadCard file={null} preData={data} isUploaded={true} />
            }</For>
          </div>
        </div>
      </div>
      <div class="w-screen h-screen fixed bg-black bg-gradient-to-t from-[#02712d] via-[#033a1a] to-[#030a0c] overflow-hidden -z-40">
        <div class="arrows w-full h-full relative -bottom-3/4">
          <For each={Array(24).fill(Math.random)}>{(rnd, i) =>
            <div class="relative">
              <div class={`absolute`} style={{ "width": `${getRandomInt(56, 128)}px`, "animation-duration": `${getRandomInt(4000, 6000)}ms`, "bottom": `-${getRandomInt(350, 550)}px`, "animation-delay": `${getRandomInt(10, 5000)}ms`, "margin-left": `${getRandomInt(0, 100)}%` }}>{arrow('white')}</div>
            </div>
          }</For>
        </div>
        <div class="dots w-screen h-1/2 absolute -bottom-1/2">
          <For each={Array(100).fill(Math.random)}>{(rnd, i) =>
            <div class="relative">
              <div class={`absolute z-40 bg-white rounded-full`} style={{ "width": `2px`, "height": `2px`, "animation-duration": `${getRandomInt(4000, 6000)}ms`, "animation-delay": `${getRandomInt(1, 6000)}ms`, "margin-left": `${getRandomInt(0, 100)}%` }} />
            </div>
          }
          </For>
        </div>
        <div class="absolute h-3/4 w-screen big-arrow bottom-0">
          {arrow('#001707')}
        </div>
      </div>
    </>
  );
};
