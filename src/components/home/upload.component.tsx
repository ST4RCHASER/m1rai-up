import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { miraiHistory, UploadCard } from './uploadcard.component'

import '../../assets/styles/home.css'
import '../../assets/styles/animate.css'
;(
  window as unknown as {
    uploadLimit: number
  }
).uploadLimit = 1024 * 1024 * 100

export const Upload = () => {
  const [processCard, setProcessCard] = useState([] as File[])
  const local = localStorage.getItem('m1rai.history')
  const [finishedCard, setFinishedCard] = useState([])

  const onUploadFile = (files: File[]) => {
    setProcessCard([...processCard, ...files])
    console.log(files, processCard)
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted(files) {
      console.log('Accepted files:', files)
      onUploadFile(files.map((f) => f).slice(0, 10))
    },
  })
  useEffect(() => {
    if (!local) {
      localStorage.setItem('m1rai.history', JSON.stringify([]))
    }
    setFinishedCard(JSON.parse(local || JSON.stringify([])).reverse())
  }, [])

  return (
    <>
      <main>
        <div className='absolute right-0 z-50 mr-4 mt-4 cursor-pointer rounded border bg-[#040c03] bg-opacity-80 px-2 py-1 font-bold text-white duration-200 hover:border-[#0aff0a] hover:bg-[#0aff0a] hover:text-black'>
          Account (Soon)
        </div>
        <div
          {...getRootProps()}
          className={`${isDragActive ? 'z-50 opacity-100' : 'z-30 opacity-0'} fixed flex h-screen w-screen items-center justify-center bg-black bg-opacity-80 duration-200`}
        >
          <h1 className='text-3xl font-bold text-white md:text-6xl'>Drag here to upload</h1>
          <input
            {...getInputProps()}
            type='file'
            title='Click to pick and upload'
            className='absolute h-full w-full opacity-0'
          />
        </div>
        <div className='absolute top-0 w-full p-6 text-white'>
          <div className='w-fit text-6xl font-bold italic'>
            M1RAI
            <span className='ml-2 text-sm font-normal'>(up.mir.ai)</span>
          </div>
          <div className='p-4 text-lg'>
            <p>Welcome to m1rai up</p>
            <p className='mb-2'>
              <span className='hidden md:inline'>Drag &aposand drop or click</span>
              <span className='inline md:hidden'>Touch</span> anywhere to upload
            </p>
            <div className='hidden md:block'>
              <p>Upload using cURL:</p>
              <p className='mb-16 text-base italic sm:mb-14 md:mb-8'>
                <span className='absolute z-40 select-all'>
                  curl --upload-file ./hello.txt https://up.m1r.ai/upload
                </span>
              </p>
              <p>
                ShareX:{' '}
                <a
                  href='https://m1r.ai/9/406os.sxcu'
                  target='_blank'
                  rel='noreferrer'
                  className='absolute z-40 ml-2 underline'
                >
                  Click here
                </a>
              </p>
            </div>
            <p className='absolute z-40 mb-2'></p>
            <p>Up to 100MiB allowed</p>
            <div className='mt-4 hidden md:block'>
              <p>
                Need temporary file url?
                <br />
                Check out s3kai for temporary file upload:{' '}
                <a
                  rel='noreferrer'
                  href='https://up.s3k.ai'
                  target='_blank'
                  className='absolute z-40 ml-2 underline'
                >
                  Click here
                </a>
              </p>
            </div>
          </div>
          <div className='px-4 py-2'>
            {(finishedCard && finishedCard?.length > 0) ||
              (processCard && processCard?.length > 0 && 'History')}
          </div>
          <div className='hidden'>
            Pending: {processCard.length} | Local: {finishedCard.length}
          </div>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3 p-2'>
            {processCard.map((data, i) => (
              <UploadCard
                key={`process_${i}`}
                file={data}
                preData={null}
                isUploaded={false}
                index={i + 1}
              />
            ))}
            {finishedCard.map((data: miraiHistory, i: number) => (
              <UploadCard key={`finished_${i}`} file={null} preData={data} isUploaded={true} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
