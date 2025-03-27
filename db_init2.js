const sqlite3 = require('sqlite3').verbose();

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('movies.db', (err) => {
    if (err) {
        console.error("데이터베이스 연결 오류:", err.message);
    } else {
        console.log("SQLite3 데이터베이스 연결 성공");
    }
});

// `comments` 테이블 생성 (닉네임 추가)
db.run(`
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER,
        content TEXT NOT NULL,
        nickname TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error("테이블 생성 오류:", err.message);
    } else {
        console.log("comments 테이블이 성공적으로 생성되었습니다.");
    }
});
