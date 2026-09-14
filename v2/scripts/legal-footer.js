(()=>{
  const stage=document.getElementById('stage');
  if(!stage)return;

  if(!document.getElementById('tmdb-legal-footer-style')){
    const style=document.createElement('style');
    style.id='tmdb-legal-footer-style';
    style.textContent=`
      .tmdb-legal-footer{
        position:relative;
        z-index:4;
        width:min(1240px,calc(100% - 56px));
        margin:18px auto 34px;
        padding:18px 0 0;
        border-top:1px solid rgba(255,255,255,.10);
        color:rgba(255,255,255,.38);
        text-align:center;
        font:500 9px/1.45 Inter,system-ui,sans-serif;
        letter-spacing:.035em;
      }
      @media(max-width:700px),(pointer:coarse){
        .tmdb-legal-footer{
          width:calc(100% - 28px);
          margin:-34px auto 24px;
          padding-top:16px;
          color:rgba(255,255,255,.34);
          font-size:8px;
          line-height:1.5;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const copy='This product uses the TMDB API but is not endorsed or certified by TMDB.';
  const enhance=()=>{
    stage.querySelectorAll('.era-screen').forEach(screen=>{
      if(screen.querySelector(':scope > .tmdb-legal-footer'))return;
      const footer=document.createElement('footer');
      footer.className='tmdb-legal-footer';
      footer.setAttribute('aria-label','TMDB attribution');
      footer.textContent=copy;
      screen.appendChild(footer);
    });
  };

  enhance();
  new MutationObserver(()=>requestAnimationFrame(enhance)).observe(stage,{childList:true,subtree:false});
})();