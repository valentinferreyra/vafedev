"use client";

import { useState } from "react";
import Image from "next/image";

type ReadingState = "Reading" | "Read" | "Backlog";
const states: ReadingState[] = ["Reading", "Read", "Backlog"];
const books: { title: string; author: string; state: ReadingState; topic: string; note: string; cover?: string }[] = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", state: "Read", topic: "Data systems", note: "", cover: "https://images.cdn3.buscalibre.com/fit-in/660x660/66/c1/66c1faade053a0f90c2452c1d972fc55.jpg" },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", state: "Read", topic: "Software engineering", note: "", cover: "https://images.cdn2.buscalibre.com/fit-in/660x660/03/1a/031af9d7e401bb2d08911c317ecbedad.jpg" },
];

export function BooksPreview() {
  const [filter, setFilter] = useState<"All" | ReadingState>("All");
  return (
    <section className="books-page">
      <p className="eyebrow">Library / Books</p>
      <h1>Books</h1>
      <p className="books-intro">What I’m reading, what stayed with me, and what’s next.</p>
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
            {!books.some((book) => book.state === state) ? <p className="book-note">{state === "Reading" ? "No books in progress right now." : "No books on the backlog yet."}</p> : null}
            <ul>
              {books.filter((book) => book.state === state).map((book) => (
                <li key={book.title} className="book-row">
                  {book.cover ? <Image className="book-cover-image" src={book.cover} alt={`Cover of ${book.title} by ${book.author}`} width={110} height={158} unoptimized /> : <div className={`book-cover book-cover-${state.toLowerCase()}`} aria-hidden="true"><span>VF / LIBRARY</span><strong>{book.title}</strong><span>EXAMPLE EDITION</span></div>}
                  <div className="book-copy">
                    <p className="book-topic">{book.topic}</p>
                    <h3>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    {book.note ? <p className="book-note">{book.note}</p> : null}
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
