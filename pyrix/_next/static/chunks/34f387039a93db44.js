(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,819378,e=>{"use strict";async function o(e,o){if(!o)return void await e("about:blankの新規タブを開けませんでした。");try{let s=await t();o.document.write(s),o.document.close(),await e("IndexedDBのデータを新規タブにエクスポートしました。")}catch(t){let o="";o="object"==typeof t&&null!==t&&"message"in t?t.message:String(t),await e(`IndexedDBエクスポート失敗: ${o}`)}}async function t(){let e=await (window.indexedDB.databases?window.indexedDB.databases():[]),o=[];for(let t of e){let e=t.name;if(!e||e.startsWith("pyxis-fs"))continue;let s=window.indexedDB.open(e),n=await new Promise((e,o)=>{s.onsuccess=()=>e(s.result),s.onerror=()=>o(s.error)}),a=Array.from(n.objectStoreNames),r={name:e,version:n.version,stores:[]};for(let e of a){let o=n.transaction(e,"readonly").objectStore(e).getAll(),t=await new Promise((e,t)=>{o.onsuccess=()=>e(o.result),o.onerror=()=>t(o.error)});r.stores.push({name:e,items:t})}o.push(r),n.close()}return`<!DOCTYPE html><html lang='ja'><head><meta charset='utf-8'><title>IndexedDB Export</title>
    <style>
      body {
        font-family: 'Menlo', 'Monaco', 'Consolas', 'monospace';
        background: #222;
        color: #eee;
        padding: 1em;
        margin: 0;
        overflow-x: auto;
      }
      h1 {
        color: #8cf;
        margin-bottom: 0.5em;
        font-size: 2em;
      }
      .db {
        border: 1px solid #444;
        border-radius: 6px;
        margin-bottom: 0.7em;
        background: #282c34;
        box-shadow: 0 1px 4px #0004;
        padding: 0.5em;
      }
      .db-header {
        cursor: pointer;
        font-size: 1em;
        color: #8cf;
        margin-bottom: 0.2em;
        user-select: none;
        padding: 0.2em 0.3em;
        display: flex;
        align-items: center;
      }
      .arrow {
        display: inline-block;
        width: 1em;
        text-align: center;
        margin-right: 0.2em;
        color: #fc8;
        font-weight: bold;
        transition: transform 0.2s;
      }
      .json-collapsible {
        margin-left: 0.7em;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(.4,0,.2,1);
      }
      .json-collapsible:not(.collapsed) {
        max-height: 1000px;
        overflow: auto;
      }
      .items {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(.4,0,.2,1);
      }
      .items:not(.collapsed) {
        max-height: 300px;
        overflow: auto;
      }
      .db-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(.4,0,.2,1);
      }
      .db-content:not(.collapsed) {
        max-height: 2000px;
        overflow: auto;
      }
      .store {
        border-left: 2px solid #fc8;
        margin-bottom: 0.4em;
        padding-left: 0.5em;
        background: #23272e;
        border-radius: 2px;
      }
      .store-header {
        cursor: pointer;
        color: #fc8;
        font-size: 0.95em;
        margin-bottom: 0.1em;
        user-select: none;
        padding: 0.1em 0.2em;
      }
      .items {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 0.2em;
      }
      .item {
        margin-left: 0.5em;
        padding: 0.1em 0.2em;
        border-bottom: 1px solid #333;
        background: #222;
        color: #b8e986;
        font-size: 0.92em;
        white-space: pre-wrap;
      }
      .item:nth-child(even) {
        background: #252525;
      }
      .collapsed {
        display: none;
      }
      .count {
        color: #aaa;
        font-size: 0.85em;
        margin-left: 0.3em;
      }
      .json-key {
        color: #8cf;
      }
      .json-string {
        color: #fc8;
      }
      .json-number {
        color: #8f8;
      }
      .json-boolean {
        color: #f88;
      }
      .json-null {
        color: #888;
      }
      .json-array-toggle, .json-object-toggle {
        cursor: pointer;
        color: #8cf;
        font-weight: bold;
        margin-right: 0.2em;
        font-size: 0.92em;
      }
      .json-collapsible {
        margin-left: 0.7em;
      }
      .json-array-item, .json-object-item {
        margin-bottom: 0.1em;
      }
      .footer {
        margin-top: 1em;
        color: #888;
        font-size: 0.85em;
        text-align: right;
      }
      ::-webkit-scrollbar {
        width: 6px;
        background: #222;
      }
      ::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 3px;
      }
    </style>
  </head><body>
    <h1>IndexedDB Export</h1>
    <div style='margin-bottom:0.5em;'>
      <button onclick='expandAll()' style='margin-right:0.5em;padding:0.2em 0.5em;'>すべて展開</button>
      <button onclick='collapseAll()' style='padding:0.2em 0.5em;'>すべて閉じる</button>
    </div>
    <div id='dbs'>
      ${o.map((e,o)=>`
        <div class='db'>
          <div class='db-header' onclick='toggleDb(${o}, this)'><span class='arrow'>▶</span>DB: ${e.name} (v${e.version}) <span class='count'>[${e.stores.length} stores]</span></div>
          <div class='db-content collapsed'>
            ${e.stores.map((e,t)=>`
              <div class='store'>
                <div class='store-header' onclick='toggleStore(${o},${t}, this)'><span class='arrow'>▶</span>Store: ${e.name} <span class='count'>[${e.items.length} items]</span></div>
                <div class='items collapsed' id='items-${o}-${t}'>
                  ${0===e.items.length?"<div class='item'>No items</div>":e.items.map((e,s)=>`<div class='item'>[${s}] ${function e(o,t=""){if(null===o)return"<span class='json-null'>null</span>";if(Array.isArray(o)){let s=`item-${t}`;return`<span class='json-array-toggle' onclick="toggleItem('${s}',this)"><span class='arrow'>▶</span> [Array(${o.length})]</span> <div class='json-array json-collapsible collapsed' id='${s}'>${o.map((o,s)=>`<div class='json-array-item'>[${s}] ${e(o,`${t}-${s}`)}</div>`).join("")}</div>`}if("object"==typeof o){let s=Object.keys(o),n=`item-${t}`;return`<span class='json-object-toggle' onclick="toggleItem('${n}',this)"><span class='arrow'>▶</span> {Object(${s.length})}</span> <div class='json-object json-collapsible collapsed' id='${n}'>${s.map(s=>`<div class='json-object-item'><span class='json-key'>"${s}"</span>: ${e(o[s],`${t}-${s}`)}</div>`).join("")}</div>`}return"string"==typeof o?`<span class='json-string'>"${o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}"</span>`:"number"==typeof o?`<span class='json-number'>${o}</span>`:"boolean"==typeof o?`<span class='json-boolean'>${o}</span>`:String(o)}(e,`${o}-${t}-${s}`)}</div>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
    <div class='footer'>Generated at ${new Date().toLocaleString("ja-JP")}</div>
    <script>
      function toggleDb(dbIdx, el) {
        const db = document.querySelectorAll('.db')[dbIdx];
        const content = db.querySelector('.db-content');
        content.classList.toggle('collapsed');
        const arrow = el.querySelector('.arrow');
        if (arrow) arrow.style.transform = content.classList.contains('collapsed') ? '' : 'rotate(90deg)';
      }
      function toggleStore(dbIdx, storeIdx, el) {
        const items = document.getElementById('items-' + dbIdx + '-' + storeIdx);
        if (items) items.classList.toggle('collapsed');
        const arrow = el.querySelector('.arrow');
        if (arrow) arrow.style.transform = items.classList.contains('collapsed') ? '' : 'rotate(90deg)';
      }
      function toggleItem(id, el) {
        const elTarget = document.getElementById(id);
        if (elTarget) elTarget.classList.toggle('collapsed');
        const arrow = el.querySelector('.arrow');
        if (arrow) arrow.style.transform = elTarget.classList.contains('collapsed') ? '' : 'rotate(90deg)';
      }
      function expandAll() {
        document.querySelectorAll('.collapsed').forEach(e => e.classList.remove('collapsed'));
        document.querySelectorAll('.arrow').forEach(e => e.style.transform = 'rotate(90deg)');
      }
      function collapseAll() {
        document.querySelectorAll('.db-content, .items, .json-collapsible').forEach(e => e.classList.add('collapsed'));
        document.querySelectorAll('.arrow').forEach(e => e.style.transform = '');
      }
      // 初期状態: すべて閉じる
      window.onload = () => { collapseAll(); };
    </script>
  </body></html>`}e.s(["exportIndexeddbHtml",()=>t,"exportIndexeddbHtmlWithWindow",()=>o])}]);