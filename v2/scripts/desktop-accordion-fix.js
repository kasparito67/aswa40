(()=>{
  const stage=document.getElementById('stage');
  if(!stage)return;

  let syncing=false;

  const closeSection=sec=>{
    const toggle=sec?.querySelector(':scope > .toggle');
    if(sec?.classList.contains('open')&&toggle)toggle.click();
  };

  const sidebarCardFor=control=>control?.closest('.insight-item,.year-insight-card,.director-card');
  const sidebarControlFor=card=>{
    if(card?.classList.contains('insight-item'))return card.querySelector('.insight-card');
    if(card?.classList.contains('year-insight-card'))return card.querySelector('.year-toggle');
    if(card?.classList.contains('director-card'))return card.querySelector('.director-toggle-action');
    return null;
  };
  const closeSidebarCard=card=>{
    const control=sidebarControlFor(card);
    if(card?.classList.contains('is-open')&&control)control.click();
  };

  // app-desktop performs the clicked card's own open/close on the target first.
  // This bubbling listener then closes any other open sibling. Because it does not
  // depend on DOM order, switching from a lower card to one above works exactly like
  // switching downward.
  stage.addEventListener('click',event=>{
    if(syncing)return;

    const sectionToggle=event.target.closest?.('.sec > .toggle');
    if(sectionToggle){
      const current=sectionToggle.parentElement;
      if(!current?.classList.contains('open'))return;
      const stack=current.closest('.stack');
      if(!stack)return;
      const others=[...stack.querySelectorAll(':scope > .sec.open')].filter(sec=>sec!==current);
      if(!others.length)return;
      syncing=true;
      others.forEach(closeSection);
      syncing=false;
      return;
    }

    const sidebarControl=event.target.closest?.('.insight-card,.year-toggle,.director-toggle-action');
    if(!sidebarControl)return;
    const current=sidebarCardFor(sidebarControl);
    if(!current?.classList.contains('is-open'))return;
    const sidebar=current.closest('.site-sidebar');
    if(!sidebar)return;
    const others=[...sidebar.querySelectorAll('.insight-item.is-open,.year-insight-card.is-open,.director-card.is-open')].filter(card=>card!==current);
    if(!others.length)return;
    syncing=true;
    others.forEach(closeSidebarCard);
    syncing=false;
  });
})();