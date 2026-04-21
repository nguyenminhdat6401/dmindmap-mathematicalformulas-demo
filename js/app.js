(function(){
    'use strict';
    
    /* =========================
       DOM (GIỮ NGUYÊN ID GỐC)
    ========================= */
    const svg = document.getElementById('canvas');
    const nodesG = document.getElementById('nodesGroup');
    const edgesG = document.getElementById('edgesGroup');
    
    /* =========================
       STATE
    ========================= */
    let nodes = [];
    let edges = [];
    let idCounter = 0;
    let selectedId = null;
    
    /* =========================
       UTIL
    ========================= */
    function createSVG(tag){
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    }
    
    /* =========================
       NODE
    ========================= */
    function addNode(x, y){
      idCounter++;
      const node = {
        id: 'n' + idCounter,
        x, y,
        w: 120,
        h: 40,
        label: 'New Node'
      };
      nodes.push(node);
      render();
    }
    
    function updateNode(id, newLabel){
      const n = nodes.find(n=>n.id===id);
      if(!n) return;
      n.label = newLabel;
      render();
    }
    
    /* =========================
       EDGE
    ========================= */
    function addEdge(from, to){
      if(from === to) return;
      idCounter++;
      edges.push({
        id: 'e' + idCounter,
        from,
        to
      });
      render();
    }
    
    /* =========================
       RENDER
    ========================= */
    function render(){
      if(!nodesG || !edgesG) return;
    
      nodesG.innerHTML = '';
      edgesG.innerHTML = '';
    
      // edges
      edges.forEach(e=>{
        const from = nodes.find(n=>n.id===e.from);
        const to = nodes.find(n=>n.id===e.to);
        if(!from || !to) return;
    
        const path = createSVG('path');
    
        const x1 = from.x + from.w;
        const y1 = from.y + from.h/2;
        const x2 = to.x;
        const y2 = to.y + to.h/2;
        const cx = (x1 + x2) / 2;
    
        path.setAttribute('d', `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
        path.setAttribute('class','mm-edge');
    
        edgesG.appendChild(path);
      });
    
      // nodes
      nodes.forEach(n=>{
        const g = createSVG('g');
        g.setAttribute('class','mm-node');
        g.setAttribute('data-id', n.id);
    
        const rect = createSVG('rect');
        rect.setAttribute('x', n.x);
        rect.setAttribute('y', n.y);
        rect.setAttribute('width', n.w);
        rect.setAttribute('height', n.h);
        rect.setAttribute('rx', 10);
        rect.setAttribute('class','node-body');
    
        const fo = createSVG('foreignObject');
        fo.setAttribute('x', n.x);
        fo.setAttribute('y', n.y);
        fo.setAttribute('width', n.w);
        fo.setAttribute('height', n.h);
    
        const div = document.createElement('div');
        div.className = 'node-label';
        div.textContent = n.label;
    
        fo.appendChild(div);
    
        g.appendChild(rect);
        g.appendChild(fo);
    
        /* =========================
           EVENTS (KHÔNG đụng HTML)
        ========================= */
    
        // select
        g.addEventListener('click', (e)=>{
          e.stopPropagation();
          selectedId = n.id;
        });
    
        // edit
        g.addEventListener('dblclick', (e)=>{
          e.stopPropagation();
          startEdit(n);
        });
    
        nodesG.appendChild(g);
      });
    }
    
    /* =========================
       EDIT INLINE
    ========================= */
    function startEdit(node){
      const input = document.createElement('input');
      input.value = node.label;
    
      input.style.position = 'fixed';
      input.style.left = node.x + 'px';
      input.style.top = node.y + 'px';
      input.style.zIndex = 9999;
    
      document.body.appendChild(input);
      input.focus();
    
      input.onblur = ()=>{
        node.label = input.value || node.label;
        input.remove();
        render();
      };
    }
    
    /* =========================
       CANVAS EVENTS
    ========================= */
    if(svg){
      svg.addEventListener('dblclick', (e)=>{
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addNode(x, y);
      });
    }
    
    /* =========================
       INIT
    ========================= */
    addNode(300,200);
    
    })();