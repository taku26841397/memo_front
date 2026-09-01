// src/components/AddForm.jsx
export const AddForm = ({ title, setTitle, text, setText, addMemo }) => {
    return (
        <div className="input-area">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトル"
            />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="内容"
            />
            <button className="add-btn" onClick={addMemo}>
                追加
            </button>
        </div>
    );
};
