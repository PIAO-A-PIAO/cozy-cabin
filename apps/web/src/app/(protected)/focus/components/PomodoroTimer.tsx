import React, { useEffect, useState } from 'react'

type StatusType = "idle" | "running" | "paused"
function PomodoroTimer() {
    const [timeRemaining, setTimeRemaining] = useState(1500)
    const [status, setStatus] = useState<StatusType>("idle")

    const handleClick = () => {
        localStorage.removeItem("timeRemaining")
        switch (status) {
            case "idle":
                return handleStart()
            case "paused":
                return handleResume()
            case "running":
                return handlePause()
        }
    }

    const handleStart = () => {
        localStorage.setItem("endTime", String(Date.now() + timeRemaining * 1000))
        localStorage.setItem("timerStatus", "running")
        setStatus("running")
    }

    const handlePause = () => {
        localStorage.setItem("timerStatus", "paused")
        localStorage.setItem("timeRemaining", String(timeRemaining))
        setStatus("paused")
    }

    const handleResume = () => {
        localStorage.setItem("endTime", String(Date.now() + timeRemaining * 1000))
        localStorage.setItem("timerStatus", "running")
        setStatus("running")
    }

    const handleReset = () => {
        localStorage.removeItem("timeRemaining")
        localStorage.removeItem("endTime")
        setTimeRemaining(1500)
        setStatus("idle")
    }

    const formatTime = (seconds: number) => {
        const minute = Math.floor(seconds / 60)
        const second = seconds % 60
        return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    }

    useEffect(() => {
        const restoreTime = async () => {
            const timerStatus = localStorage.getItem("timerStatus") as StatusType
            if (timerStatus == "paused") {
                setTimeRemaining(Number(localStorage.getItem("timeRemaining")))
                setStatus(timerStatus)
                return
            }
            const endTime = localStorage.getItem("endTime")
            if (endTime) {
                const timeDifference = Number(endTime) - Date.now()
                const toNumber = Math.max(0, Math.floor(timeDifference / 1000))
                setTimeRemaining(toNumber)
                setStatus(timerStatus)
            }
        }
        restoreTime()
    }, [])

    useEffect(() => {
        let interValid: NodeJS.Timeout
        if (status == "running") {
            interValid = setInterval(() => {
                setTimeRemaining((prev) => prev - 1)
            }, 1000)
        }
        return () => {
            if (interValid) {
                clearInterval(interValid)
            }
        }
    }, [status])

    const buttonLabel = (() => {
        switch (status) {
            case "idle":
                return "Start";
            case "running":
                return "Pause";
            case "paused":
                return "Resume";
        }
    })()

    return (
        <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Pomodoro
            </p>
            <div className="font-mono text-6xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
                {formatTime(timeRemaining)}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={handleClick}
                    className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {buttonLabel}
                </button>
                <button
                    disabled={status == "idle"}
                    onClick={handleReset}
                    className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                    Reset
                </button>
            </div>
        </section>

    )
}

export default PomodoroTimer
