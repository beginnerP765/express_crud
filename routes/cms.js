var express = require('express');
var router = express.Router();
const pool = require('../db');
const { check, validationResult } = require('express-validator');

var params = {
  'title': "CMS",
}

// バリデーションの指定
const validator = [
  check('title', '空白です。').not().isEmpty(),
  check('title', '5文字以上30文字以下で入力してください。').isLength({ min: 5, max: 30 }),
  check('content', '空白です。').not().isEmpty(),
  check('content', '4000文字以下で入力してください。').isLength({ max: 4000 }),
];

router.get('/', validator, function(req, res, next){
  (async () => {
    try {
      const [results, fields] = await pool.query('SELECT * FROM cms');
      let data = { cms: results, params: params };
      res.render('cms/index', data);
    } catch (err) {
      console.log(err);
    }
  })();
});

// レコードの追加
router.get('/add', (req, res, next) => {
  let data = { params: params };
  res.render('cms/add', data);
});

router.post('/add', validator, (req, res, next) => {
  const errors = validationResult(req);
  let title = req.body.title;
  let content = req.body.content;

  if (!errors.isEmpty()) {
    // バリデーションエラーがあった場合の処理
    let data = { 'title': title, 'content': content, errors: errors.array(), params: params };
    res.render('cms/add', data);
  } else {
    // バリデーションエラーが無かった場合の処理
    let data = { 'title' : title, 'content' : content };

    (async () => {
      try {
        const [results, fields] = await pool.query('INSERT INTO cms SET ?', data);
        res.redirect('/cms');
      } catch (err) {
        console.log(err);
      }
    })();
  }
});

// レコードの表示
router.get('/show/:id', (req, res, next) => {
  let id = req.params.id;

  (async () => {
    try {
      const [results, fields] = await pool.query('SELECT * FROM cms where id=?', id);
      let data = { cms: results[0], params: params }
      res.render('cms/show', data);
    } catch (err) {
      console.log(err);
    }
  })();
});

// 編集画面の遷移
router.get('/edit/:id', (req, res, next) => {
  let id = req.params.id;

  (async () => {
    try {
      const [results, fields] = await pool.query('SELECT * FROM cms where id=?', id);
      let data = { cms: results[0], params: params }
      res.render('cms/edit', data);
    } catch (err) {
      console.log(err);
    }
  })();
});

// 編集フォーム送信の処理
router.post('/edit', validator, (req, res, next) => {
  const errors = validationResult(req);
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;

  if (!errors.isEmpty()) {
    // バリデーションエラーがあった場合の処理
    let data = {
      cms: {'id': id, 'title': title, 'content': content},
      errors: errors.array(),
      params: params
    };

    res.render('cms/edit', data);
  } else {
    // バリデーションエラーが無かった場合の処理
    let data = { 'title' : title, 'content' : content };

    (async () => {
      try {
        const [results, fields] = await pool.query('UPDATE cms SET ? WHERE id = ?', [data, id]);
        res.redirect('/cms');
      } catch (err) {
        console.log(err);
      }
    })();
  }
});

// 削除画面への遷移
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  (async () => {
    try {
      const [results, fields] = await pool.query('SELECT * FROM cms WHERE id = ?', id);
      let data = { cms: results[0], params: params }
      res.render('cms/delete', data);
    } catch (err) {
      console.log(err);
    }
  })();
});

// 削除フォームの送信処理
router.post('/delete', (req, res, next) => {
  let id = req.body.id;

  (async () => {
    try {
      const [results, fields] = await pool.query('DELETE FROM cms WHERE id = ?', id);
      res.redirect('/cms');
    } catch (err) {
      console.log(err);
    }
  })();
});

module.exports = router;