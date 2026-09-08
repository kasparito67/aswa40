(()=>{
  if(TOPS.some(t=>t.id==='documentaires')) return;

  TOPS.push({
    id:'documentaires',
    label:'Documentaires',
    community:'Top en préparation',
    theme:{accent:'#d6d9dc',secondary:'#87949b',bg:'#080a0b',panel:'#0e1214'},
    hero:{
      image:'../assets/cinema-hero.jpg',
      line:'Les',
      em:'documentaires',
      position:'center 52%'
    },
    films:[],
    ghosts:[],
    sections:[
      {kicker:'Les gros scoreurs',title:'TOP 25',kind:'top25'},
      {kicker:'Le classement complet',title:'#26–…',kind:'placeholder'},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'placeholder'},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'placeholder'}
    ],
    sidebar:[]
  });
})();
