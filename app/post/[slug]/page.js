"use client"
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import Image from "next/image";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

const getPostBySlug = async (slug) => {
  const querySnapshot = await getDocs(
    query(collection(db, "blogs"), where("slug", "==", slug))
  );
  if (querySnapshot.empty) {
    return null;
  }
  const postDoc = querySnapshot.docs[0];
  const post = postDoc.data();
  return post;
};

const deletePostBySlug = async(slug) =>{
  try{
    const querySnapshot = await getDocs(
      query(collection(db, "blogs"), where("slug", "==", slug))
    );
    // console.log(querySnapshot.docs)
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(docSnapshot.ref);
      const desertRef = ref(storage, `uploads/${slug}.png`);
      // Delete the file
      deleteObject(desertRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
        throw error
      });
    };
    toast("post delete successfully");
    window.location.replace("/");
  }catch(error){
    console.log(error)
  }
}

export default async function Page({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post) return null;

  // console.log(post?.date);

  return (
    <div className="container px-5 py-24 mx-auto">
      <div className="max-w-2xl mx-auto">
        <img src={post.image === undefined ? "/asset/test.jfif" : post.image} alt="Blog Post Image" className="w-full" width="500" height="500" />
        <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
        <div
          className="mt-4 prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        {/* <button className="btn bg-red-100" onClick={()=>{deletePostBySlug(slug)}}>Delete</button> */}
        <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-2" onClick={()=>{deletePostBySlug(slug)}}>Delete Post</button>
      </div>
    </div>
  );
}
