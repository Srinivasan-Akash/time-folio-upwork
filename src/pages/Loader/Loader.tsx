import loader from "./loader.json"
import Lottie from 'lottie-react'
import "./loader.scss"

export default function Loader() {
  return (
    <div className='loader'>
        <Lottie animationData={loader}>

        </Lottie>
    </div>
  )
}
