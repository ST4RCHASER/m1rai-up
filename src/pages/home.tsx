import Arrow from '@/components/home/Arrow'
import { Upload } from '@/components/home/upload.component'
export default function Home() {
  const getRandomInt = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min
  }
  return (
    <div>
      <Upload />
      <div className='fixed -z-40 h-screen w-screen overflow-hidden bg-black bg-gradient-to-t from-[#02712d] via-[#033a1a] to-[#030a0c]'>
        <div className='arrows relative -bottom-3/4 h-full w-full'>
          {Array(24)
            .fill(Math.random() * 1000)
            .map((_, i) => {
              return (
                <div className='relative' key={`${i}`}>
                  <div
                    className={`absolute`}
                    style={{
                      opacity: '0%',
                      width: `${getRandomInt(56, 128)}px`,
                      animationDuration: `${getRandomInt(4000, 6000)}ms`,
                      bottom: `-${getRandomInt(350, 550)}px`,
                      animationDelay: `${getRandomInt(10, 5000)}ms`,
                      marginLeft: `${getRandomInt(0, 100)}%`,
                    }}
                  >
                    {<Arrow color='#FFFFFF' />}
                  </div>
                </div>
              )
            })}
        </div>
        <div className='dots absolute -bottom-1/2 h-1/2 w-screen'>
          {Array(100)
            .fill(Math.random() * 1000)
            .map((_, i) => {
              return (
                <div className='relative' key={`${i}`}>
                  <div
                    className={`absolute z-40 rounded-full bg-white`}
                    style={{
                      width: `2px`,
                      height: `2px`,
                      animationDuration: `${getRandomInt(4000, 6000)}ms`,
                      animationDelay: `${getRandomInt(1, 6000)}ms`,
                      marginLeft: `${getRandomInt(0, 100)}%`,
                    }}
                  />
                </div>
              )
            })}
        </div>
        <div className='big-arrow absolute bottom-0 h-3/4 w-screen'>
          {<Arrow color='#001707' />}
        </div>
      </div>
    </div>
  )
}
