import { useEffect, useState } from 'react'
import { Stream } from '../constants/Interfaces'
import { useActiveStream } from './useActiveStream'


export const useLastActiveStream = () => {
	const activeStream = useActiveStream()
	const [lastActiveStream, setLastActiveStream] = useState<Stream>()

	useEffect(() => {
		if (!activeStream) return
		setLastActiveStream(activeStream?.activeStream)
	}, [activeStream])

	return lastActiveStream
}

