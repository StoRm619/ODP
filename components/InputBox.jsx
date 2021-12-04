import { useSession } from "next-auth/client"
import Image from "next/image"
import { EmojiHappyIcon } from '@heroicons/react/outline'
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid'
import { db } from "../firebase";
import { useRef, useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
function InputBox() {
    const [session] = useSession();
    const inputRef = useRef(null);
    const filepickerRef = useRef(null);
    const [imageToPost, setImageToPost] = useState(null);
    const sendPost = (e) => {
        e.preventDefault();
        if (!inputRef.current.value) return;
        // Add a new document with a generated id.
        addDoc(collection(db, "posts"), {
            message: inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp: serverTimestamp(),
        }).then(docum => {

            if (imageToPost) {
                const storage = getStorage();
                const storageRef = ref(storage, `posts/${docum.id}`);
                const uploadTask = uploadBytesResumable(storageRef, imageToPost, "data_url");
                removeImage();
                uploadTask.on('state_changed', null,
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((URL) => {
                                setDoc(doc(db, "posts", docum.id), { postImage: URL }, { merge: true });
                            });
                    }
                )

            };
        });
        inputRef.current.value = ""
    }
    const addImageToPost = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result)
        }
    }
    const removeImage = () => {
        setImageToPost(null)
    }
    return (
        <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
            <div className="flex space-x-4 p-4 items-center">
                <Image
                    className="rounded-full"
                    src={session.user.image}
                    width="40"
                    height="40"
                    layout="fixed"
                />
                <form className="flex flex-1">
                    <input className=" rounded-full h-12 bg-gray-100 flex-grow
                    px-5 focus:outline-none"
                        type="text"
                        ref={inputRef}
                        placeholder={`What's you thinking, ${session.user.name}?`}></input>
                    <button hidden onClick={sendPost}>
                        Sumbit
                    </button>
                </form>
                {imageToPost && (
                    <div onClick={removeImage} className="flex flex-col filter hover:brightness-110 transition duration-150 transform
                    hover:scale-105 cursor-pointer">
                        <img className="h-10 object-contain" src={imageToPost} alt="" />
                        <p className="text-xs text-red-500 text-center">Remove</p>
                    </div>
                )}
            </div>
            <div className="flex justify-evenly p-3 border-t">
                <div className="inputIcon">
                    <VideoCameraIcon className="h-7 text-red-500" />
                    <p className="text-xs sm:text-sm xl:text-base">
                        LiveVideo
                    </p>
                </div>

                <div onClick={() => filepickerRef.current.click()} className="inputIcon">
                    <CameraIcon className="h-7 text-green-400" />
                    <p className="text-xs sm:text-sm xl:text-base">
                        Photo/Video
                    </p>
                    <input ref={filepickerRef} onChange={addImageToPost} type="file" hidden></input>
                </div>

                <div className="inputIcon">
                    <EmojiHappyIcon className="h-7 text-yellow-300" />
                    <p className="text-xs sm:text-sm xl:text-base">
                        Emotion
                    </p></div>

            </div>
        </div>
    )
}

export default InputBox
