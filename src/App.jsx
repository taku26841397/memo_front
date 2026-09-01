import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

import { AddForm } from "./components/AddForm";
import { EditForm } from "./components/EditForm";

function MemoDetail({ memos }) {
  const { id } = useParams();
  const memo = memos.find((m) => m.id === Number(id));

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);


  if (!memo) return <div>メモがありません</div>;

  const updateDetail = () => {
    fetch(`http://localhost:8000/api/memos/${memo.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        alert("更新しました");
        setIsEditing(false);
      });
  };

  return (
    <div className="detail-container">
      <div className="note-detail">
        {isEditing ? (
          <>
            <input
              className="memo-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <textarea
              className="memo-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={5}
            />

            <button className="update-btn" onClick={updateDetail}>
              更新する
            </button>
            <Link to="/" className="back-link">戻る</Link>
          </>
        ) : (
          <>
            <h2>{memo.title}</h2>
            <div className="note-paper">{memo.content}</div>
            <div className="detail-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                編集する
              </button>

              <Link to="/" className="back-link">戻る</Link>
            </div>
          </>
        )}

      </div>

    </div>
  );




}



function App() {

  const [memos, setMemos] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");


  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const memosPerPage = 10; // 1ページ10件


  useEffect(() => {
    fetch("http://localhost:8000/api/memos/")
      .then((res) => res.json())
      .then((data) => setMemos(data));
  }, []);

  const addMemo = () => {
    fetch("http://localhost:8000/api/memos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: text }),
    })
      .then((res) => res.json())
      .then((newMemo) => {
        setMemos([newMemo, ...memos]);
        setText("");
      });
  };

  const startEdit = (memo) => {
    setEditId(memo.id);
    setTitle(memo.title)
    setText(memo.content);
  };

  const updateMemo = () => {
    fetch(`http://localhost:8000/api/memos/${editId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: text }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setMemos(
          memos.map((memo) =>
            memo.id === updated.id ? updated : memo
          )
        );
        setText("");
        setEditId(null);
      });
  };

  const deleteMemo = (id) => {
    fetch(`http://localhost:8000/api/memos/${id}/`, {
      method: "DELETE",
    }).then(() => {
      setMemos(memos.filter((memo) => memo.id !== id));
    });
  };


  const groupByDate = (items) => {
    const groups = {};

    items.forEach((memo) => {
      const date = memo.created_at?.slice(0, 10) || "日付なし";

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(memo);
    });

    return groups;
  };


  // const grouped = groupByDate(memos);



  const indexOfLastMemo = currentPage * memosPerPage;
  const indexOfFirstMemo = indexOfLastMemo - memosPerPage;
  const currentMemos = memos.slice(indexOfFirstMemo, indexOfLastMemo);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(memos.length / memosPerPage); i++) {
    pageNumbers.push(i);
  }

  const grouped = groupByDate(currentMemos);


  const totalPages = Math.ceil(memos.length / memosPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <div className="container">
            <h1 className="title">メモ帳</h1>

            <div className="input-area">
              {editId ? (
                <EditForm
                  title={title}
                  setTitle={setTitle}
                  text={text}
                  setText={setText}
                  updateMemo={updateMemo}
                  cancelEdit={() => setEditId(null)}
                />
              ) : (
                <AddForm
                  title={title}
                  setTitle={setTitle}
                  text={text}
                  setText={setText}
                  addMemo={addMemo}
                />
              )}

            </div>

            <div className="memo-list">
              {Object.keys(grouped).map((date) => (
                <div key={date} className="memo-date-group">

                  <h2 className="memo-date-title">{date}</h2>

                  {grouped[date].map((memo) => (
                    <div key={memo.id} className="memo-item">
                      <Link to={`/detail/${memo.id}`}>
                        <p className="memo-text">{memo.title}</p>
                      </Link>

                      <p className="memo-preview">
                        {memo.content.slice(0, 80)}...
                      </p>

                      <div className="memo-actions">
                        <button className="edit-btn" onClick={() => startEdit(memo)}>編集</button>
                        <button className="delete-btn" onClick={() => deleteMemo(memo.id)}>削除</button>
                      </div>
                    </div>
                  ))}

                </div>
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="page-btn"
              >
                前へ
              </button>

              <span className="page-info">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                次へ
              </button>
            </div>


          </div>

        } />

        <Route path="/detail/:id" element={<MemoDetail memos={memos} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
