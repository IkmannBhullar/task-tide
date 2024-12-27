import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Load journal entry from local storage
  useEffect(() => {
    const storedEntry = JSON.parse(localStorage.getItem(`journal-${date}`)) || "";
    setEntry(storedEntry);
  }, [date]);

  // Save journal entry to local storage
  useEffect(() => {
    localStorage.setItem(`journal-${date}`, JSON.stringify(entry));
  }, [entry, date]);

  return (
    <JournalWrapper>
      <Header>
        <h1>Your Journal</h1>
        <DatePicker
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Header>

      <EditorWrapper>
        <ReactQuill value={entry} onChange={setEntry} />
      </EditorWrapper>
    </JournalWrapper>
  );
};

export default Journal;

// Styled Components
const JournalWrapper = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  color: ${(props) => props.theme.colors.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }
`;

const DatePicker = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.white};
`;

const EditorWrapper = styled.div`
  .ql-editor {
    min-height: 300px;
    background-color: ${(props) => props.theme.colors.white};
    border-radius: 5px;
    padding: 10px;
    box-shadow: ${(props) => props.theme.shadows.medium};
  }

  .ql-toolbar {
    border-radius: 5px;
    margin-bottom: 10px;
  }
`;