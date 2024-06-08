import React from "react"
import {Image} from "@nextui-org/react"
import {Typewriter} from "react-simple-typewriter"

export default function Loading() {
  return (
    <div className="flex items-center flex-col justify-center h-screen bg-stone-100 dark:bg-black">
      <Image
        src={'images/loading.gif'}
        layout={'responsive'}
        height={400}
        width={400}
        alt={`Loading`}
        unoptimized={true}
      />
      <br/>
      <p className="text-white text-2xl font-semibold">
        <Typewriter
          loop={0}
          cursor={true}
          cursorBlinking={true}
          typeSpeed={100}
          deleteSpeed={100}
          delaySpeed={200}
          words={[
            "Loading...",
          ]}
        />
      </p>
    </div>
  )
}