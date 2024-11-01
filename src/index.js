import initSqlJs from "sql.js";

import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import dbFile from "../db.sqlite3?url";

import "./boundary-canvas.js"
import "./map.js"

const log = msg => document.getElementById("log").innerText += msg

let db;
const init = async () => {
  try {
    const SQL = await initSqlJs({ locateFile: () => sqlWasm });
    const file = await fetch(dbFile)
    const buffer = await file.arrayBuffer()
    const dbData = new Uint8Array(buffer)
    db = new SQL.Database(dbData);
  } catch (err) {
    log(err);
  }
}

const runQuery = () => {
  const query = document.getElementById("query").value;

  const result = db.exec(query)
  drawPoints(result[0]?.values?.map(item => [item[1], item[2], item[3]]) || [])
}

document.getElementById("queryForm").addEventListener("submit", e => {
  e.preventDefault()
  runQuery()
})

document.getElementById("queryForm").addEventListener('keydown', function (e) {
  if (e.key === "Enter") {
    if (e.ctrlKey) {
      runQuery()
    }
  }
});

document.getElementById("simpleForm").addEventListener("submit", e => {
  e.preventDefault()
  const value = document.getElementById("endingWith").value
  document.getElementById("suffixTitle").innerHTML = value
  document.getElementById("query").value = `SELECT * FROM places WHERE name LIKE '%${value}'`
  runQuery()
})

init()