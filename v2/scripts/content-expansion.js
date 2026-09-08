(()=>{
  function bindYearRollovers(){
    document.querySelectorAll('.era-screen').forEach(screen=>{
      const top=TOPS.find(t=>t.id===screen.dataset.topId);
      const item=top?.sidebar?.find(x=>x.kind==='year');
      const chart=screen.querySelector('.year-card .year-chart');
      if(!item||!chart)return;
      const bars=[...chart.querySelectorAll('.year-bar')];
      bars.forEach((bar,i)=>{
        const year=item.yearStart+i;
        const count=item.bars[i]||0;
        bar.dataset.tip=`${year} · ${count} film${count>1?'s':''}`;
        bar.tabIndex=count?0:-1;
        const activate=()=>{
          chart.classList.add('is-exploring');
          bars.forEach(x=>x.classList.remove('is-highlighted'));
          bar.classList.add('is-highlighted');
        };
        const clear=()=>{
          chart.classList.remove('is-exploring');
          bars.forEach(x=>x.classList.remove('is-highlighted'));
        };
        if(count){
          bar.addEventListener('pointerenter',activate);
          bar.addEventListener('pointerleave',clear);
          bar.addEventListener('focus',activate);
          bar.addEventListener('blur',clear);
        }
      });
    });
  }

  function improveDirectorDisclosure(){
    const screen=document.querySelector('.era-screen[data-top-id="1975-1999"]');
    if(!screen)return;
    const card=screen.querySelector('.directors-card');
    if(!card)return;
    const detail=card.querySelector('.director-list');
    if(detail)detail.setAttribute('aria-label','Autres réalisateurs marquants');
  }

  requestAnimationFrame(()=>{
    bindYearRollovers();
    improveDirectorDisclosure();
  });
})();
