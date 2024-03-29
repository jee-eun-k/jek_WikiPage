"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Title from "../title/page";
import ReactPaginate from "react-paginate";
import { getPosts } from "@/api/route";
import { useRecoilState, useResetRecoilState } from "recoil";
import { postState, postListState } from "@/store/state";
import styles from "../../page.module.css";

const itemsPerPage = 5;

export default function Main() {
  const router = useRouter();

  const resetPostState = useResetRecoilState(postState);

  const [posts, setPosts] = useRecoilState(postListState);
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = posts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts.length / itemsPerPage);

  const listItems = () => {
    return currentItems.map((item) => (
      <Title key={item.id} post={{ id: item.id, post: item.post }} />
    ));
  };

  useEffect(() => {
    const getPostsData = async () => {
      await getPosts()
        .then((response) => response.json())
        .then((data) => setPosts(() => data.data))
        .catch((error) => alert(error));
    };
    getPostsData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <span
        style={{
          fontSize: "18px",
        }}
      >
        {"위키 목록"}
      </span>
      <div
        style={{
          display: "flex",
          width: "100vw",
          justifyContent: "flex-end",
          marginRight: "8vw",
        }}
      >
        <button
          style={{ border: "1px solid blue" }}
          onClick={() => {
            resetPostState();
            router.push("/component/post");
          }}
        >
          {"추가"}
        </button>
      </div>
      <ul
        className={styles.ReactPaginate}
        style={{ width: "100%", listStyleType: "none" }}
      >
        {listItems()}
      </ul>
      <div
        style={{
          width: "100vw",
        }}
      >
        <ReactPaginate
          onPageChange={(event) =>
            setItemOffset((event.selected * itemsPerPage) % posts.length)
          }
          pageRangeDisplayed={itemsPerPage}
          pageCount={pageCount}
          className="pagination-list"
          nextLabel=">"
          previousLabel="<"
          activeClassName="pagination-active"
        />
      </div>
    </div>
  );
}
