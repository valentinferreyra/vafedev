"use client";

import { useState } from "react";
import Image from "next/image";

type ReadingState = "Reading" | "Read" | "Backlog";
const states: ReadingState[] = ["Reading", "Read", "Backlog"];
const books: { title: string; author: string; state: ReadingState; topic: string; note: string; cover?: string }[] = [
  { title: "Systems & trade-offs", author: "Example author", state: "Reading", topic: "Architecture", note: "A short note about what drew me to this book and the questions I’m exploring." },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", state: "Read", topic: "Data systems", note: "", cover: "https://images.cdn3.buscalibre.com/fit-in/660x660/66/c1/66c1faade053a0f90c2452c1d972fc55.jpg" },
  { title: "Learning together", author: "Example author", state: "Read", topic: "Teaching", note: "A brief reflection on what stayed with me after finishing the book." },
  { title: "Thinking in data", author: "Example author", state: "Backlog", topic: "Data", note: "Why this book is on my list and what I hope to learn from it." },
  { title: "Teams that build", author: "Example author", state: "Backlog", topic: "Collaboration", note: "A question I’d like this book to help me answer." },
];

export function BooksPreview() {
  const [filter, setFilter] = useState<"All" | ReadingState>("All");
  return (
    <section className="books-page">
      <p className="eyebrow">Library / Books</p>
      <h1>Books</h1>
      <p className="books-intro">What I’m reading, what stayed with me, and what’s next.</p>
      <p className="books-preview-note">Design preview · Designing Data-Intensive Applications is a confirmed read. Entries credited to “Example author” are fictional examples, not my reading history.</p>
      <div className="book-filters" role="group" aria-label="Filter books by reading status">
        {(["All", ...states] as const).map((state) => (
          <button key={state} type="button" aria-pressed={filter === state} onClick={() => setFilter(state)}>
            {state} <span>{state === "All" ? books.length : books.filter((book) => book.state === state).length}</span>
          </button>
        ))}
      </div>
      <div aria-live="polite" className="books-shelves">
        {states.filter((state) => filter === "All" || filter === state).map((state) => (
          <section key={state} aria-label={`${state} books`} className="book-shelf">
            <div className="section-heading"><h2>{state}</h2><span>{books.filter((book) => book.state === state).length} books</span></div>
            <ul>
              {books.filter((book) => book.state === state).map((book) => (
                <li key={book.title} className="book-row">
                  {book.cover ? <Image className="book-cover-image" src={book.cover} alt={`Cover of ${book.title} by ${book.author}`} width={110} height={158} unoptimized /> : <div className={`book-cover book-cover-${state.toLowerCase()}`} aria-hidden="true"><span>VF / LIBRARY</span><strong>{book.title}</strong><span>EXAMPLE EDITION</span></div>}
                  <div className="book-copy">
                    <p className="book-topic">{book.topic}</p>
                    <h3>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    {book.note ? <p className="book-note">{book.note}</p> : null}
                    {state === "Read" && !book.cover ? <details className="book-reflection"><summary>Reading note</summary><p>A longer reflection could live here. A full review would belong in the blog.</p></details> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
