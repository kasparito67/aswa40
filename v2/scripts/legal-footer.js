(()=>{
  const stage=document.getElementById('stage');
  if(!stage)return;

  const TMDB_URL='https://www.themoviedb.org/';
  const TMDB_LOGO='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg';
  const copy='This product uses the TMDB API but is not endorsed or certified by TMDB.';

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
      .tmdb-legal-footer-inner{
        display:grid;
        grid-template-columns:1fr auto 1fr;
        align-items:center;
        gap:14px;
        min-width:0;
      }
      .tmdb-legal-attribution{
        grid-column:2;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:11px;
        min-width:0;
      }
      .tmdb-legal-version{
        grid-column:3;
        justify-self:end;
        white-space:nowrap;
        color:inherit;
        font:inherit;
        letter-spacing:inherit;
      }
      .tmdb-legal-logo-link{
        display:inline-flex;
        align-items:center;
        flex:0 0 auto;
        line-height:0;
      }
      .tmdb-legal-logo{
        display:block;
        width:58px;
        height:auto;
      }
      .tmdb-legal-copy{min-width:0}
      @media(max-width:700px),(pointer:coarse){
        .tmdb-legal-footer{
          width:calc(100% - 28px);
          margin:-34px auto 24px;
          padding-top:16px;
          color:rgba(255,255,255,.34);
          font-size:8px;
          line-height:1.5;
        }
        .tmdb-legal-footer-inner{
          grid-template-columns:minmax(0,1fr) auto;
          gap:10px;
        }
        .tmdb-legal-attribution{
          grid-column:1;
          justify-content:flex-start;
          gap:9px;
          text-align:left;
        }
        .tmdb-legal-version{
          grid-column:2;
        }
        .tmdb-legal-logo{
          width:50px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const enhance=()=>{
    stage.querySelectorAll('.era-screen').forEach(screen=>{
      if(screen.querySelector(':scope > .tmdb-legal-footer'))return;
      const footer=document.createElement('footer');
      footer.className='tmdb-legal-footer';
      footer.setAttribute('aria-label','TMDB attribution');

      const inner=document.createElement('div');
      inner.className='tmdb-legal-footer-inner';

      const attribution=document.createElement('div');
      attribution.className='tmdb-legal-attribution';

      const link=document.createElement('a');
      link.className='tmdb-legal-logo-link';
      link.href=TMDB_URL;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('aria-label','The Movie Database (TMDB)');

      const logo=document.createElement('img');
      logo.className='tmdb-legal-logo';
      logo.src=TMDB_LOGO;
      logo.alt='TMDB';
      logo.loading='lazy';
      logo.decoding='async';
      link.appendChild(logo);

      const text=document.createElement('span');
      text.className='tmdb-legal-copy';
      text.textContent=copy;

      const version=document.createElement('span');
      version.className='tmdb-legal-version';
      version.textContent='v 1.0';

      attribution.append(link,text);
      inner.append(attribution,version);
      footer.appendChild(inner);
      screen.appendChild(footer);
    });
  };

  enhance();
  new MutationObserver(()=>requestAnimationFrame(enhance)).observe(stage,{childList:true,subtree:false});
})();