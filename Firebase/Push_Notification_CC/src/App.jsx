import React, { useEffect } from 'react'
import { generateToken, messaging } from './Utils/Firebase'
import { onMessage } from 'firebase/messaging';
import toast, { Toaster } from 'react-hot-toast'
function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification.body);
    })
  }, [])
  return (
    <>
      <Toaster position='top-right' />
      <div>App</div>
    </>
  )
}

export default App