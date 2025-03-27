const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

// 엑셀 파일 읽기
const workbook = XLSX.readFile('movies.xlsx');
const sheetName = workbook.SheetNames[0];  // 첫 번째 시트 사용
const sheet = workbook.Sheets[sheetName];

// 엑셀 데이터를 JSON 형식으로 변환
const moviesData = XLSX.utils.sheet_to_json(sheet);

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('movies.db', (err) => {
    if (err) {
        console.error("데이터베이스 연결 오류:", err.message);
    } else {
        console.log("SQLite3 데이터베이스 연결 성공");
    }
});

// 테이블 생성 (없으면 생성)
db.run(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_title TEXT,
        overview TEXT,
        release_date TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        popularity REAL,
        vote_average REAL,
        vote_count INTEGER
    )
`);

// 데이터 삽입
const insertMovie = db.prepare(`
    INSERT INTO movies (original_title, overview, release_date, poster_path, backdrop_path, popularity, vote_average, vote_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

moviesData.forEach((movie) => {
    insertMovie.run(
        movie['Original Title'],
        movie['Overview'],
        movie['Release Date'],
        movie['Poster Path'],
        movie['Backdrop Path'],
        movie['Popularity'],
        movie['Vote Average'],
        movie['Vote Count']
    );
});

insertMovie.finalize(() => {
    console.log("모든 영화 데이터가 SQLite3 데이터베이스에 삽입되었습니다.");
});

// 데이터베이스 연결 종료
db.close((err) => {
    if (err) {
        console.error("데이터베이스 종료 오류:", err.message);
    } else {
        console.log("데이터베이스 연결이 종료되었습니다.");
    }
});
