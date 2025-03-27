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
app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id; // URL에서 영화 id 추출
    const sql = 'SELECT * FROM movies WHERE id = ?';

    db.get(sql, [movieId], (err, row) => {
        if (err) {
            console.error("영화 상세 데이터 조회 오류:", err.message);
            res.status(500).json({ error: '영화 상세 데이터를 가져오는 데 실패했습니다.' });
        } else {
            if (row) {
                res.json(row); // 영화 상세 정보를 JSON 형식으로 응답
            } else {
                res.status(404).json({ error: '영화를 찾을 수 없습니다.' });
            }
        }
    });
});

// 댓글 작성 API
app.post('/movies/:id/comments', express.json(), (req, res) => {
    const movieId = req.params.id;
    const { content, nickname } = req.body;

    if (!content || content.trim() === '' || !nickname || nickname.trim() === '') {
        return res.status(400).json({ error: '댓글 내용과 닉네임을 모두 작성해야 합니다.' });
    }

    const sql = 'INSERT INTO comments (movie_id, content, nickname) VALUES (?, ?, ?)';
    db.run(sql, [movieId, content, nickname], function (err) {
        if (err) {
            console.error("댓글 작성 오류:", err.message);
            res.status(500).json({ error: '댓글을 작성하는 데 실패했습니다.' });
        } else {
            res.status(201).json({
                id: this.lastID,
                movie_id: movieId,
                content,
                nickname,
                created_at: new Date().toISOString()
            });
        }
    });
});


// 댓글 조회 API
// 댓글 목록 불러오기 API
app.get('/movies/:id/comments', (req, res) => {
    const movieId = req.params.id;

    const sql = 'SELECT * FROM comments WHERE movie_id = ? ORDER BY created_at DESC';
    db.all(sql, [movieId], (err, rows) => {
        if (err) {
            console.error("댓글 조회 오류:", err.message);
            res.status(500).json({ error: '댓글을 불러오는 데 실패했습니다.' });
        } else {
            res.json(rows); // 댓글 목록을 JSON으로 반환
        }
    });
});
