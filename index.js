const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(cors())

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});


// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('movies.db', (err) => {
    if (err) {
        console.error("데이터베이스 연결 오류:", err.message);
    } else {
        console.log("SQLite3 데이터베이스 연결 성공");
    }
});


//회원 가입


//로그인


//검색


//영화 목록
app.get('/movies', (req, res) => {
    const sql = 'SELECT id, original_title, poster_path, vote_average FROM movies';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("영화 데이터 조회 오류:", err.message);
            res.status(500).json({ error: '영화 데이터를 가져오는 데 실패했습니다.' });
        } else {
            console.log("영화 데이터:", rows);  // 데이터 로그 출력
            res.json(rows); 
        }
    });
});

//영화 상세글
//상세글은 다 보여줄 것임

