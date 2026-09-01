// src/components/EditForm.jsx
export const EditForm = ({
    title,
    setTitle,
    text,
    setText,
    updateMemo,
    cancelEdit,
}) => {
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
            <button className="update-btn" onClick={updateMemo}>
                更新
            </button>
            <button className="cancel-btn" onClick={cancelEdit}>
                キャンセル
            </button>
        </div>
    );
};
