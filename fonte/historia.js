/* =====================================================================
   HISTÓRIA — A Ampulheta de Cinzas
   Medidores: [Fé, Povo, Nobreza, Tesouro]. Morre em 0 e em 100.
   C(id, quem, texto, [rótulo, fé, povo, nobreza, tesouro, extras], [..], opções)
   extras: set (marca), mem (memória que fica entre retornos), die (morte),
           nx (próxima carta), delay ([cartas, id]), end (final), brk (quebra as ampulhetas)
   opções: alt [[memória ou marca, id]] troca a carta; req / not (marcas); once
   {N} = nome do herói
   ===================================================================== */

/* ---------- pessoas ---------- */
var PEOPLE={
 "Isolda":{c:"#7f9fd4",r:"A rainha menina, 17 anos"},
 "Duarte":{c:"#8a6fb8",r:"Conde de Montefrio, regente do reino"},
 "Velasco":{c:"#b5893d",r:"Bispo de Valcorte, voz da Fé"},
 "Guiomar":{c:"#6f9a5a",r:"Ladra do Beco Fundo, voz do Povo"},
 "Catarina":{c:"#a8463f",r:"Duquesa de Castelar, voz da Nobreza"},
 "Constança":{c:"#c9a24a",r:"Banqueira de Alcarra, voz do Tesouro"},
 "Leonor":{c:"#5f8fa8",r:"Aia da rainha"},
 "Violante":{c:"#9a6a8f",r:"Guardiã da Biblioteca Real"},
 "Florian":{c:"#6aa39a",r:"Médico da corte"},
 "Elmo":{c:"#8c8c8c",r:"Um estrangeiro que nunca tira o elmo"},
 "Valério":{c:"#b0483f",r:"Embaixador do Império de Bravânia"},
 "Afonso":{c:"#c47a4a",r:"Capitão da guarda do palácio"}
};

/* ---------- atos ---------- */
var ACTS=[
 {n:"Ato I",t:"O Rei Envenenado",goal:"Descubra quem envenenou o rei Aires.",d:[63,120],bg:"#2a2219",
  intro:"Valcorte, março de 1348.\n\nO sino da Sé toca pelo rei Aires, morto de repente na própria mesa. Você desce do navio com duas coisas: uma carta do abade de Alvor, endereçada à rainha, e a ampulheta de vidro negro que ele lhe deu antes de morrer.\n\n'Nunca a quebre', disse o abade. 'E nunca conte a ninguém o que ela faz.'",
  outro:"Leonor confessou. A rainha confessou. Você guardou o segredo de uma menina que matou o próprio pai.\n\nIsolda só disse uma coisa antes de mandar você embora: 'Ele ia vender Valcorte. Um dia eu te conto o resto.'\n\nNo porto, um navio chega com as velas rasgadas e os marinheiros ardendo de febre."},
 {n:"Ato II",t:"A Febre Negra",goal:"Proteja Valcorte da Peste e mantenha a rainha viva.",d:[122,181],bg:"#24221c",
  intro:"Maio de 1348.\n\nA febre que matou os monges de Alvor chegou a Valcorte. Nas ruas, as pessoas contam manchas pretas nas axilas dos vizinhos. O bispo diz que é castigo. O médico diz que é contágio. A banqueira diz que o porto não pode fechar.\n\nE todos esperam que o escrivão da rainha escreva a decisão certa.",
  outro:"A febre recua com o calor de junho. Um terço das casas tem uma cruz pintada na porta, mas a cidade continua de pé, e a rainha também.\n\nNa última noite do ato, Violante deixa um livro aberto na sua mesa. Numa iluminura antiga, duas ampulhetas negras estão unidas por um fio de cinza."},
 {n:"Ato III",t:"O Cerco de Ouro",goal:"Impeça que Valcorte seja entregue à frota de Bravânia.",d:[183,243],bg:"#26201c",
  intro:"Julho de 1348.\n\nTrinta navios com a águia de Bravânia fundeiam no estuário. O embaixador Valério desembarca com um tratado assinado pelo falecido rei: Valcorte em troca de ouro, a ser entregue no fim do verão.\n\nIsolda tinha razão sobre o pai. Ou alguém quer que pareça.",
  outro:"A frota recua para o mar aberto. Valério parte com um aperto de mão, e Isolda passa a noite inteira sentada no túmulo do pai, sem dizer nada.\n\nVocê não conta a ninguém, mas nesta manhã acordou sem lembrar a voz da sua mãe. Tentou o dia todo. Ela não volta."},
 {n:"Ato IV",t:"O Homem do Elmo",goal:"Descubra quem é Elmo e o que a ampulheta cobra.",d:[245,304],bg:"#1f1c1a",
  intro:"Setembro de 1348.\n\nA ampulheta está mais leve. A cada volta, um pouco de areia some, e com ela alguma coisa sua: um rosto, uma música, o nome de uma rua de Alvor.\n\nE em todo lugar aonde você vai, o homem de elmo fechado chega antes.",
  outro:"Agora você sabe o que a ampulheta cobra, e de quem é a outra.\n\nIsolda não chora quando você conta que sabe. Ela só pergunta, baixinho: 'Desta vez, você fica até o fim?'"},
 {n:"Ato V",t:"A Coroação",goal:"Chegue à coroação e decida o destino das ampulhetas.",d:[305,306],bg:"#221a16",
  intro:"Primeiro de novembro de 1348. Dia de Todos os Santos.\n\nHoje Isolda será coroada. Hoje as duas ampulhetas estão na mesma sala pela primeira vez. Hoje termina o ano que ela já viveu centenas de vezes.\n\nO que acontecer depois de hoje, ninguém sabe. Nem ela."}
];

/* ---------- mortes ---------- */
var MDIE={
 f0:["Herege","Sem a Igreja ao seu lado, o bispo encontra heresia nas suas cartas. A fogueira é acesa na praça da Sé, numa manhã de vento."],
 f1:["O báculo manda","A Fé manda mais que a coroa. Velasco decide que um escrivão que sabe demais é um pecado, e pecados se apagam em silêncio."],
 p0:["A turba","O povo cansou de esperar. A multidão arromba os portões do palácio, e o escrivão é o primeiro rosto que encontram."],
 p1:["Amado demais","O povo grita o seu nome mais alto que o da rainha. Os nobres não deixam você chegar ao fim da semana."],
 n0:["O golpe","Sem apoio dos nobres, a Duquesa Catarina toma o palácio numa noite. Quem escrevia pela rainha vai primeiro para a torre."],
 n1:["Marionete","Os nobres o cobrem de títulos e o enchem de fios. No dia em que você pensa sozinho, os fios apertam."],
 t0:["Cofres vazios","Os mercenários da guarda ficam sem soldo e vendem a lealdade ao primeiro que paga. O primeiro paga pela sua cabeça."],
 t1:["Ouro demais","O tesouro transborda, e o cheiro chega longe. A guilda de Alcarra manda alguém conferir as contas. Ele confere com uma faca."]
};
var DEATHS={
 taca:["A taça do banquete","O vinho é doce demais. Você percebe tarde, quando os dedos já não seguram a taça. Alguém nesta corte queria o escrivão morto desde o primeiro dia.","taca"],
 cozinha:["O cozinheiro tinha um sócio","Você mostra a moeda de Alcarra a Constança. Ela sorri e agradece. Naquela noite, a escada do seu quarto está sem um degrau.","moeda"],
 jardim:["O jardim de noite","Leonor se assusta e se vira com a faca de poda na mão. Ela chora quando percebe quem era. Você não ouve o resto.","jardim"],
 acusa_c:["Acusação errada","Constança é presa. Na mesma semana, Alcarra corta o crédito do reino e manda cobrar a dívida do seu jeito. Ela era culpada de espionar, não de matar.","prova"],
 acusa_v:["Fogueira para o bispo","Você acusa Velasco. A Fé se levanta contra a coroa e a cidade inteira se volta contra você. O bispo era culpado de muita coisa, menos daquilo.","prova"],
 expor:["A verdade na hora errada","O conselho ouve que a rainha matou o pai e a depõe na mesma hora. Duarte assume a coroa como regente. Na primeira noite, ele manda calar quem sabe demais.","expor"],
 contar:["Dedos de cinza","As palavras sobre a ampulheta travam na garganta. Algo gelado aperta o seu coração por dentro, sem que ninguém encoste em você.","contar"],
 peste:["A febre entrou pelo porto","Os navios de Alcarra atracaram. Em uma semana, a febre está em cada rua. Na segunda, está em você.","porto"],
 massacre:["A cidade que queimou","A procissão encontra o bairro dos estrangeiros sem guarda. Quando a fumaça baixa, o povo pede um culpado, e escolhe quem deixou acontecer.","massacre"],
 rainha:["A areia virou sozinha","Isolda morre de febre ao amanhecer, com três manchas pretas no pescoço. Você ainda está vivo quando o mundo escurece. A ampulheta virou mesmo assim.","rainha"],
 duarte:["O regente não aceita um não","Você recusa a proposta de Duarte na cara dele. Ele assente, educado. O vinho do jantar tem o mesmo gosto doce da taça do banquete.","duarte"],
 portao:["O portão da meia-noite","À meia-noite, alguém abre o Portão do Rio por dentro. Soldados de Bravânia entram sem um grito. Você só descobre quem foi na próxima vez.","portao"],
 negocia:["Um preço que não se paga","Você oferece ouro a Valério. Ele ri: 'Seu rei não nos chamou por ouro.' A frota toma a cidade, e você nunca descobre o que ele quis dizer.","valerio"],
 cripta:["Visto na cripta","Elmo se vira antes que você termine de descer a escada. 'De novo, não', ele diz, cansado. A pedra da cripta é fria.","cripta"],
 elmo_pergunta:["O nome proibido","Você pergunta à rainha se ela tem um irmão. Isolda fica branca, e Duarte, que escutava atrás da porta, entende tudo antes de você.","irmao"],
 sem_retorno:["Sem retorno","As ampulhetas estão quebradas. Desta vez, a areia não volta. O ano termina sem você."]
};
var MEMS={
 taca:"A taça que o regente oferece no banquete está envenenada.",
 moeda:"O cozinheiro morto tinha uma moeda de Alcarra no bolso. Mostrar isso a Constança é perigoso.",
 jardim:"De noite, Leonor enterra alguma coisa no jardim da rainha. Seguir de perto assusta a aia.",
 prova:"Sem prova, toda acusação dá errado. A prova está no jardim, com Leonor.",
 expor:"Expor a rainha entrega a coroa a Duarte.",
 contar:"Contar sobre a ampulheta mata. Não diga a ninguém.",
 porto:"Abrir o porto aos navios de Alcarra traz a febre para dentro da cidade.",
 massacre:"A procissão dos flagelantes ataca o bairro dos estrangeiros se ninguém o proteger.",
 rainha:"A ampulheta também volta quando Isolda morre. Ela pega a febre na Porta do Rio.",
 elmo1:"Elmo lembra das voltas da ampulheta, como você. Ele sabia da Porta do Rio.",
 duas:"Uma crônica fala de duas ampulhetas feitas das cinzas de um mesmo coração.",
 duarte:"Recusar Duarte de frente é morrer envenenado. É melhor fingir que aceita.",
 portao:"Duarte abre o Portão do Rio à meia-noite para a frota de Bravânia.",
 valerio:"Bravânia não veio por ouro. O rei Aires chamou a frota por outro motivo.",
 cripta:"Elmo vigia a escada da cripta. É preciso descer quando ele estiver na missa das vésperas.",
 irmao:"Perguntar à rainha sobre um irmão perto de Duarte é mortal. Fale com Violante primeiro.",
 esquece:"Cada volta da ampulheta apaga uma lembrança de quem a usa."
};

/* ---------- ATO I ---------- */
C("i_chega","","Uma carroça da corte espera no cais. 'O escrivão de Alvor? A rainha mandou buscar.' A carta do abade pesa no seu bolso, lacrada.",["Ir direto à rainha",0,0,2,0],["Abrir a carta no caminho",-2,0,0,0,{nx:"i_carta"}],{once:1,narr0:1});
C("i_carta","","A carta diz uma frase só, na letra tremida do abade: 'Ela vai precisar de você mais de uma vez.' Você dobra o papel sem entender.",["Guardar a carta",0,0,0,0],["Rasgar e esquecer",0,0,0,0],{once:1});
C("i_rainha","Isolda","Você é o copista que o abade prometeu? Então escreva por mim. Nesta corte ninguém escreve o que eu digo, só o que querem que eu diga.",["Aceitar ser o escrivão real",0,4,0,-2],["Pedir um salário primeiro",0,-2,0,4],{once:1});
C("i_tut1","Isolda","Uma regra, {N}: cada decisão agrada uns e irrita outros. Fé, Povo, Nobreza e Tesouro. Se qualquer um deles faltar, ou mandar demais, a corte devora quem escreve.",["Entendi: nem pouco, nem demais",0,0,0,0],["E se eu errar?",0,0,0,0,{nx:"i_tut2"}],{once:1});
C("i_tut2","Isolda","Então você morre, e eu arranjo outro escrivão. Brincadeira. Quase. Olhe para os quatro símbolos no alto antes de cada decisão.",["Olhar para os símbolos",0,0,0,0],["Respirar fundo",0,0,0,0],{once:1});
C("i_duarte","Duarte","Bem-vindo, menino. Eu sou o regente até a coroação. Você escreve o que a rainha diz, depois que eu tiver dito a ela o que dizer.",["Obedecer ao regente",0,-6,8,0],["Dizer que serve à rainha",0,6,-8,0],{once:1});
C("i_banquete","Duarte","No banquete do funeral, o regente estende a taça do rei. 'Beba à memória dele, escrivão. Ele gostaria.'",["Beber à memória do rei",0,0,0,0,{die:"taca"}],["Recusar a taça",0,0,-10,0],{alt:[["taca","i_banquete2"]]});
C("i_banquete2","Duarte","A mesma taça, o mesmo sorriso. Você lembra do gosto doce demais. Ninguém está olhando para a jarra de água.",["Trocar a taça pela do bispo, sem ninguém ver",-6,0,4,0,{set:"trocou"}],["Derramar a taça 'sem querer'",0,0,-4,0]);
C("i_cozinha","","Na cozinha, ninguém fala do cozinheiro Bartolomeu, morto 'de febre' um dia depois do rei. No avental dele, você acha uma moeda de ouro de Alcarra.",["Mostrar a moeda a Constança",0,0,0,0,{die:"cozinha"}],["Guardar a moeda e calar",0,0,0,0,{set:"moeda"}],{alt:[["moeda","i_cozinha2"]]});
C("i_cozinha2","","A moeda de Alcarra no avental do cozinheiro. Desta vez você não vai contar a Constança. Vai perguntar a quem não tem nada a perder.",["Perguntar a Guiomar sobre o cozinheiro",0,4,0,-2,{set:"moeda",nx:"i_guiomar_moeda"}],["Guardar a moeda e calar",0,0,0,0,{set:"moeda"}]);
C("i_guiomar_moeda","Guiomar","Bartolomeu? Vendia o que ouvia na mesa do rei para a banqueira. Espião, sim. Envenenador? Ele tinha medo de faca de cozinha.",["Agradecer com uma moeda",0,6,0,-4],["Prometer um favor",0,4,-2,0]);
C("i_bispo","Velasco","O rei morreu porque Deus quis, filho. E Deus quer uma catedral nova. A rainha deve pagar por ela, em sinal de penitência.",["Prometer a catedral",10,-4,0,-10],["Dizer que o povo precisa de pão antes",-10,8,0,0],{once:1});
C("i_violante","Violante","Você é o escrivão? Então leia isto antes que alguém queime. Uma cópia de tratado com o selo do rei Aires e da águia de Bravânia. Eu não devia ter achado.",["Guardar a cópia em segredo",0,0,0,0,{set:"tratado"}],["Devolver ao arquivo",0,0,4,0],{once:1});
C("i_leonor","Leonor","A aia da rainha cruza o pátio de madrugada com uma pá pequena e um embrulho. Ela olha para trás duas vezes.",["Segui-la de perto",0,0,0,0,{die:"jardim"}],["Fingir que não viu",0,0,0,0],{alt:[["jardim","i_leonor2"],["prova","i_leonor2"]]});
C("i_leonor2","Leonor","De novo Leonor, de novo a pá. Você sabe onde ela vai cavar. Basta esperar ela sair do jardim.",["Esperar e desenterrar o embrulho",0,0,0,0,{set:"frasco"}],["Deixar como está",0,0,0,0]);
C("i_conselho","Catarina","O conselho se reúne ao amanhecer. 'O povo quer um culpado pelo rei, escrivão. Você anda fazendo perguntas. Quem foi?'",["Apontar Constança",0,0,0,0,{die:"acusa_c"}],["Pedir mais uma noite ao conselho",0,0,-8,0,{nx:"i_noite_extra"}],{alt:[["@frasco","i_conselho2"]]});
C("i_noite_extra","Leonor","O conselho dá uma noite, nem mais. De madrugada, Leonor cruza o pátio de novo, com a pá e o embrulho. É a última chance.",["Esperar escondido e desenterrar depois",0,0,0,0,{set:"frasco",nx:"i_conselho2"}],["Desistir e apontar o bispo",0,0,0,0,{die:"acusa_v"}]);
C("i_conselho2","Catarina","O conselho se reúne ao amanhecer. No seu bolso, o frasco que Leonor enterrou, ainda com cheiro de amêndoa amarga.",["Pedir para falar antes com a rainha",0,0,-4,0,{nx:"i_confissao"}],["Mostrar o frasco ao conselho inteiro",0,0,0,0,{die:"expor"}],{alt:[["expor","i_conselho3"]]});
C("i_conselho3","Catarina","O conselho espera. No bolso, o frasco de Leonor. Você lembra do que acontece quando a verdade sai cedo demais.",["Pedir para falar antes com a rainha",0,0,-4,0,{nx:"i_confissao"}],["Dizer ao conselho que ainda investiga",0,-4,-6,0,{nx:"i_confissao"}]);
C("i_confissao","Leonor","Diante do frasco, Leonor cai de joelhos. 'Eu só fiz o que minha senhora mandou.' Atrás dela, a rainha fecha os olhos. 'Fui eu, {N}. Eu matei meu pai.'",["Prometer guardar o segredo",0,0,6,0,{set:"segredo"}],["Levar a verdade ao conselho",0,0,0,0,{die:"expor"}],{alt:[["expor","i_confissao2"]]});
C("i_confissao2","Leonor","Leonor cai de joelhos. 'Eu só fiz o que minha senhora mandou.' A rainha: 'Fui eu, {N}. Eu matei meu pai.' Você lembra do que Duarte faz quando a verdade sai.",["Guardar o segredo da rainha",0,0,6,0,{set:"segredo"}],["Dizer ao conselho que foi o cozinheiro",-6,4,0,0,{set:"segredo"}]);
/* Ato I: cartas da corte */
P(1,"i_p1","Guiomar","O pão subiu desde o enterro. O povo pede que a coroa pague a diferença aos padeiros.",["Pagar com o tesouro",0,10,0,-10],["Mandar a guilda baixar o preço",0,4,-6,0]);
P(1,"i_p2","Catarina","Os nobres querem lugar de honra no funeral, na frente do clero.",["Dar o lugar aos nobres",-8,0,8,0],["Manter o clero na frente",8,0,-8,0]);
P(1,"i_p3","Constança","Alcarra empresta ouro para o luto do reino. Juros de um em dez.",["Aceitar o empréstimo",0,0,-4,10],["Recusar com educação",0,0,4,-6]);
P(1,"i_p4","Velasco","Um pregador diz na praça que o rei morreu por pecado. Devo calá-lo?",["Calar o pregador",-8,-4,6,0],["Deixá-lo falar",6,4,-6,0]);
P(1,"i_p5","Afonso","A guarda pede botas novas antes do inverno que vem.",["Comprar as botas",0,0,6,-8],["Mandar remendar as velhas",0,0,-6,4]);
P(1,"i_p6","Guiomar","Pegaram um menino roubando pão no mercado. Querem cortar a mão dele.",["Perdoar o menino",-4,8,-4,0],["Seguir a lei",4,-8,4,0]);
P(1,"i_p7","Duarte","Os condes do norte não mandaram o imposto do luto. Mando cobrar com soldados?",["Mandar os soldados",0,-6,-6,10],["Esperar a colheita",0,4,6,-8]);
P(1,"i_p8","Velasco","As freiras de Santa Clara pedem lenha para o convento.",["Mandar a lenha do palácio",8,0,-4,-4],["Dizer que o convento se vire",-8,0,4,4]);
P(1,"i_p9","Constança","Um navio de Alcarra trouxe especiarias. Cobro imposto dobrado?",["Cobrar o dobro",0,-4,0,8],["Cobrar o normal",0,4,0,-4]);
P(1,"i_p10","Leonor","A rainha não come há dois dias. Pede que você leia para ela à noite.",["Ler para a rainha",0,0,4,0],["Dizer que está ocupado",0,0,-4,0]);

/* ---------- ATO II ---------- */
C("ii_navios","Constança","Três navios de Alcarra pedem para atracar. Florian diz que há febre a bordo. Se o porto fechar, Alcarra corta o crédito do reino.",["Deixar os navios atracarem",0,0,0,12,{delay:[3,"ii_febre_porto"]}],["Fechar o porto por quarenta dias",0,4,0,-14,{set:"quarentena"}],{once:1,alt:[["porto","ii_navios2"]]});
C("ii_navios2","Constança","Os mesmos três navios, a mesma febre a bordo. Você lembra das cruzes nas portas. Constança também lembra de cobrar.",["Fechar o porto e pedir paciência a Alcarra",0,6,0,-10,{set:"quarentena"}],["Fechar o porto e pagar a multa",0,4,0,-16,{set:"quarentena"}]);
C("ii_febre_porto","","A febre desembarcou com os marinheiros. Em três dias, o Beco Fundo inteiro está tossindo. Não há mais como fechar o que já entrou.",["Correr para o hospital",0,0,0,0,{die:"peste"}],["Trancar-se no palácio",0,0,0,0,{die:"peste"}]);
C("ii_florian","Florian","Separar os doentes, ferver a água, queimar as roupas. Não sei por que funciona, mas funciona. O bispo diz que é feitiçaria.",["Apoiar Florian",-10,6,0,-4,{set:"florian"}],["Deixar a cura com a Igreja",10,-8,0,0]);
C("ii_elmo","Elmo","Numa taverna, um homem de elmo fechado senta à sua frente sem pedir licença. 'Desta vez você não deixou a rainha ir à Porta do Rio. Bom. Da última vez, ela morreu nos seus braços.' Ele sai antes que você responda.",["Correr atrás dele",0,0,0,0,{mem:"elmo1",nx:"ii_elmo_some"}],["Ficar pensando",0,0,0,0,{mem:"elmo1"}],{once:1});
C("ii_elmo_some","","Na rua, ninguém viu um homem de elmo. Só uma menina, que diz que ele chorava.",["Voltar ao palácio",0,0,0,0],["Procurar mais um pouco",0,0,0,0]);
C("ii_flagelantes","Velasco","Uma procissão de flagelantes chega cantando. Dizem que a febre é culpa dos estrangeiros do bairro do porto. O bispo quer abrir os portões para eles.",["Mandar a guarda proteger o bairro",-10,-4,0,-4,{set:"protegeu"}],["Deixar a procissão entrar",8,6,0,0,{delay:[2,"ii_massacre"]}],{once:1,alt:[["massacre","ii_flagelantes2"]]});
C("ii_flagelantes2","Velasco","A procissão de novo. Você lembra da fumaça sobre o bairro do porto.",["Proteger o bairro e oferecer pão aos peregrinos",-6,0,0,-8,{set:"protegeu"}],["Proteger o bairro e mandar a procissão seguir viagem",-10,0,4,0,{set:"protegeu"}]);
C("ii_massacre","","A procissão encontrou o bairro dos estrangeiros sem guarda. Há fumaça sobre o porto, e a cidade procura um culpado.",["Assumir a culpa",0,0,0,0,{die:"massacre"}],["Culpar o bispo",0,0,0,0,{die:"massacre"}]);
C("ii_porta","Isolda","Vou à Porta do Rio levar pão aos doentes. Uma rainha que se esconde não merece o povo que tem.",["Ir com ela",0,8,0,-4,{delay:[2,"ii_rainha_morre"]}],["Deixá-la ir sozinha",0,6,-2,0,{delay:[2,"ii_rainha_morre"]}],{once:1,alt:[["rainha","ii_porta2"]]});
C("ii_porta2","Isolda","Vou à Porta do Rio levar pão aos doentes. Uma rainha que se esconde não merece o povo que tem.",["Impedi-la: ir você no lugar dela",0,6,0,-6,{set:"salvou"}],["Trancar a rainha no quarto",0,-8,-6,0,{set:"salvou"}]);
C("ii_rainha_morre","Florian","Florian sai do quarto da rainha com as mãos tremendo. 'Três manchas no pescoço. Ela não passa desta noite.'",["Segurar a mão dela até o fim",0,0,0,0,{die:"rainha"}],["Rezar na capela",0,0,0,0,{die:"rainha"}]);
C("ii_violante","Violante","Achei isto numa crônica de quatrocentos anos atrás: 'Da Rainha Cinzenta fizeram duas ampulhetas, uma para cada metade do coração dela.' Você sabe alguma coisa sobre ampulhetas, escrivão?",["Mentir que não sabe",0,0,0,0,{mem:"duas"}],["Contar tudo a Violante",0,0,0,0,{die:"contar"}],{once:1,alt:[["contar","ii_violante2"]]});
C("ii_violante2","Violante","'Da Rainha Cinzenta fizeram duas ampulhetas.' Violante espera uma resposta. Você lembra do aperto gelado no peito.",["Dizer que é só curiosidade de copista",0,0,0,0,{mem:"duas"}],["Mudar de assunto",0,0,0,0,{mem:"duas"}]);
C("ii_fim","Florian","O calor de junho mata as pulgas e acalma a febre. Florian conta as cruzes nas portas e para de contar no meio. 'Podia ter sido pior. Muito pior.'",["Agradecer a Florian",0,4,0,0],["Ir ver a rainha",0,0,4,0]);
P(2,"ii_p1","Florian","Faltam lençóis no hospital de campanha. Posso queimar os dos mortos e comprar novos?",["Comprar lençóis novos",0,6,0,-8],["Lavar e reaproveitar",0,-6,0,4]);
P(2,"ii_p2","Velasco","As igrejas estão lotadas de gente rezando. Peço que a coroa proíba as tavernas até a febre passar.",["Fechar as tavernas",8,-8,0,-2],["Deixar as tavernas abertas",-8,6,0,2]);
P(2,"ii_p3","Guiomar","Os coveiros cobram três vezes mais. Os pobres estão enterrando os mortos no quintal.",["A coroa paga os coveiros",0,8,0,-10],["Abrir uma vala comum fora dos muros",-6,-2,0,4]);
P(2,"ii_p4","Catarina","Os nobres querem fugir para os solares do campo e levar os guardas.",["Deixar os nobres irem",0,-8,8,0],["Exigir que fiquem",0,6,-8,0]);
P(2,"ii_p5","Constança","Os boticários sobem o preço do vinagre e das ervas. Tabelo o preço?",["Tabelar o preço",0,8,-2,-6],["Deixar o mercado decidir",0,-6,0,6]);
P(2,"ii_p6","Afonso","Um guarda fugiu do posto por medo da febre. A lei manda enforcar desertores.",["Perdoar o guarda",0,4,-6,0],["Cumprir a lei",4,-6,6,0]);
P(2,"ii_p7","Velasco","Um monge diz que a febre acaba se a rainha andar descalça até a Sé.",["Pedir que a rainha vá",10,4,-6,0],["Recusar a penitência",-10,0,4,0]);
P(2,"ii_p8","Guiomar","Saqueadores invadem as casas dos mortos. O povo pede ronda à noite.",["Mandar a guarda fazer ronda",0,8,0,-6],["Dizer que cada um proteja a sua casa",0,-8,4,2]);
P(2,"ii_p9","Leonor","A rainha quer visitar os doentes do hospital. Florian acha perigoso.",["Deixar a visita, com máscara de ervas",0,8,-4,0],["Proibir a visita",0,-6,4,0]);
P(2,"ii_p10","Constança","Alcarra oferece comprar as joias da coroa por um bom preço, para pagar o hospital.",["Vender as joias",-4,4,-8,12],["Guardar as joias",0,0,6,-6]);

/* ---------- ATO III ---------- */
C("iii_frota","Valério","Trinta navios de Bravânia no estuário. O embaixador Valério estende um tratado com o selo do rei Aires. 'Valcorte é do Império no fim do verão. Seu rei assinou.'",["Pedir tempo para a rainha ler",0,0,4,0],["Dizer que o rei está morto e o tratado também",0,6,-4,0],{once:1});
C("iii_isolda","Isolda","Agora você entende por que eu fiz aquilo? Duarte me mostrou o tratado na véspera. Meu pai ia nos vender. Eu tinha uma noite para decidir.",["Dizer que entende",0,0,6,0],["Dizer que ela devia ter pedido ajuda",0,0,-4,0],{once:1});
C("iii_duarte","Duarte","Proposta simples, escrivão. Honramos o tratado em segredo, eu fico vice-rei, a rainha continua no trono, de enfeite. E você continua vivo. Combinado?",["Recusar de frente",0,0,0,0,{die:"duarte"}],["Fingir que aceita",0,0,8,0,{set:"espiao"}],{once:1,alt:[["duarte","iii_duarte2"]]});
C("iii_duarte2","Duarte","A mesma proposta, o mesmo sorriso. Você lembra do vinho doce demais.",["Fingir que aceita e pedir os detalhes",0,0,8,0,{set:"espiao"}],["Fingir que aceita e pedir uma parte do ouro",0,0,6,6,{set:"espiao"}]);
C("iii_catarina","Catarina","Se a cidade for vendida, os nobres perdem as terras. Eu posso reunir cem cavaleiros, mas quero o nome da rainha numa carta, me dando o comando.",["Escrever a carta para Catarina",0,0,10,-4,{set:"cavaleiros"}],["Dizer que a guarda basta",0,0,-8,4]);
C("iii_constanca","Constança","Mercenários custam caro, e Alcarra não gosta de Bravânia no nosso estuário. Pago a defesa da cidade. Em troca, quero o porto livre de impostos por dez anos.",["Aceitar o acordo",0,-4,0,12],["Recusar o acordo",0,4,0,-8]);
C("iii_valerio","Valério","À noite, Valério pede para falar com você a sós. 'Seu rei não nos chamou por ouro, escrivão. Ele pediu nossos médicos contra a Peste. A frota traz médicos. Alguém trocou as cartas dele.'",["Pedir a carta verdadeira",0,0,0,0,{set:"carta",mem:"valerio"}],["Não acreditar nele",0,0,4,0],{once:1,alt:[["valerio","iii_valerio2"]]});
C("iii_valerio2","Valério","Valério pede para falar a sós. Desta vez você já sabe o que ele vai dizer, e pede antes: a carta verdadeira do rei Aires.",["Pegar a carta e comparar a letra",0,0,0,0,{set:"carta"}],["Levar Violante para comparar",0,0,0,0,{set:"carta"}]);
C("iii_forjada","Violante","Violante compara as duas cartas com uma lente. 'A do tratado é falsa. O traço do A é do regente. Duarte forjou o tratado, e mostrou à rainha na véspera da morte do pai.'",["Contar à rainha agora",0,0,0,0,{nx:"iii_isolda_sabe"}],["Esperar o momento certo",0,0,0,0],{req:"carta",once:1});
C("iii_isolda_sabe","Isolda","Isolda lê as duas cartas três vezes. Não chora. Só fala depois de muito tempo: 'Então eu matei um inocente porque um mentiroso pediu.'",["Ficar ao lado dela em silêncio",0,0,6,0],["Prometer que Duarte vai pagar",0,4,4,0]);
C("iii_noite","Duarte","Duarte passa por você no corredor e sussurra: 'Hoje à noite. Fique no seu quarto, escrivão.'",["Ficar no quarto",0,0,0,0,{delay:[1,"iii_portao_aberto"]}],["Vigiar o portão principal",0,0,0,0,{delay:[1,"iii_portao_aberto"]}],{once:1,alt:[["portao","iii_noite2"]]});
C("iii_portao_aberto","","À meia-noite, alguém abre o Portão do Rio por dentro. Botas de soldado ecoam no cais.",["Tocar o sino",0,0,0,0,{die:"portao"}],["Correr para a rainha",0,0,0,0,{die:"portao"}]);
C("iii_noite2","Afonso","Você sabe a hora e o portão. O capitão Afonso só precisa de uma ordem escrita.",["Mandar Afonso esperar no Portão do Rio",0,4,4,0,{set:"pegou"}],["Ir pessoalmente com a guarda",0,6,2,0,{set:"pegou"}]);
C("iii_flagra","Afonso","À meia-noite, Afonso pega o regente com a chave do Portão do Rio na mão. 'Estava conferindo a tranca', diz Duarte. Sem outra prova, o conselho o solta ao amanhecer.",["Protestar no conselho",0,4,-6,0],["Engolir a raiva",0,-2,2,0],{req:"pegou",alt:[["@carta","iii_flagra2"]]});
C("iii_flagra2","Afonso","À meia-noite, Afonso pega o regente com a chave do Portão do Rio. Você põe a carta forjada na mesa do conselho, ao lado da chave. Duarte não resiste. Só sorri para você.",["Prender Duarte",0,6,-4,0,{set:"duarte_preso"}],["Mandá-lo para a torre",0,4,0,0,{set:"duarte_preso"}]);
C("iii_frota_sai","Valério","Ao amanhecer, Valério desembarca médicos em vez de soldados. Ninguém em Valcorte sabe se agradece ou se desconfia.",["Receber os médicos com a rainha",0,8,-4,-4],["Pagar os médicos e pedir que partam logo",0,-4,4,-8],{once:1});
C("iii_duarte_cela","Duarte","Na cela, Duarte ri baixinho. 'Você acha que eu sou o pior desta corte? Pergunte à rainha quantas vezes ela já viveu este verão.'",["Perguntar o que ele quis dizer",0,0,0,0],["Ir embora sem olhar",0,0,0,0],{req:"duarte_preso",once:1});
C("iii_fugiu","Afonso","Duarte sumiu do palácio na mesma noite, com dois cavalos e o selo do regente. Ninguém sabe para onde.",["Mandar procurá-lo",0,0,4,-6,{set:"duarte_fugiu"}],["Deixar ir",0,0,-4,0,{set:"duarte_fugiu"}],{not:"duarte_preso",once:1});
P(3,"iii_p1","Catarina","Os cavaleiros pedem para treinar nos campos do povo. Vão pisar a colheita.",["Deixar treinar",0,-8,8,0],["Mandar treinar na praia",0,4,-6,0]);
P(3,"iii_p2","Constança","Com a frota no estuário, ninguém compra nada. As lojas pedem perdão de impostos.",["Perdoar os impostos",0,8,0,-10],["Cobrar normalmente",0,-8,0,6]);
P(3,"iii_p3","Velasco","O bispo quer uma procissão contra os 'hereges de Bravânia'.",["Aprovar a procissão",10,4,-4,-4],["Proibir a procissão",-10,0,4,0]);
P(3,"iii_p4","Guiomar","No Beco Fundo, dizem que a rainha vai fugir de navio. O povo quer vê-la na praça.",["A rainha aparece na praça",0,8,-4,0],["Mandar arautos desmentirem",0,-4,4,-2]);
P(3,"iii_p5","Afonso","As muralhas do porto têm rachaduras. Consertar custa caro.",["Consertar as muralhas",0,0,6,-10],["Escorar com madeira",0,-2,-4,4]);
P(3,"iii_p6","Constança","Um capitão de Bravânia quer comprar vinho na cidade. Pagando bem.",["Vender o vinho",-4,-4,0,10],["Recusar",4,4,0,-4]);
P(3,"iii_p7","Catarina","Um conde do sul pede a mão da rainha em casamento, com cem lanças de dote.",["Considerar o pedido",0,-4,10,4],["Recusar em nome da rainha",0,4,-10,0]);
P(3,"iii_p8","Velasco","Um padre escondeu soldados de Bravânia doentes na igreja dele.",["Deixar os doentes ficarem",6,-6,-4,0],["Mandar prender o padre",-8,4,4,0]);
P(3,"iii_p9","Guiomar","Os pescadores não podem sair por causa da frota. As famílias passam fome.",["Distribuir trigo do celeiro real",0,10,0,-8],["Mandar pescar no rio",0,-4,0,2]);
P(3,"iii_p10","Leonor","A rainha não dorme. Pergunta se você pode ficar no corredor, só para ouvir passos conhecidos.",["Ficar no corredor",0,0,4,0],["Mandar Leonor ficar",0,0,-2,0]);

/* ---------- ATO IV ---------- */
C("iv_esquece","","Você acorda e procura na memória o rosto da sua mãe. Encontra só um borrão de luz numa janela de Alvor. A ampulheta, na mesa, parece mais leve.",["Escrever tudo o que ainda lembra",0,0,0,0,{mem:"esquece"}],["Fingir que não percebeu",0,0,0,0,{mem:"esquece"}],{once:1});
C("iv_elmo","Elmo","Elmo espera você na escadaria da Sé. 'Já sentiu, não sentiu? Ela cobra. Eu paguei tanto que esqueci meu próprio rosto.'",["Perguntar quem ele é",0,0,0,0],["Perguntar o que a ampulheta cobra",0,0,0,0,{mem:"esquece"}],{once:1});
C("iv_cripta","","Elmo desce todas as noites à cripta debaixo da Sé, com uma lanterna. Você poderia segui-lo.",["Descer logo atrás dele",0,0,0,0,{die:"cripta"}],["Voltar outro dia",0,0,0,0,{nx:"iv_cripta_volta"}],{alt:[["cripta","iv_cripta2"]]});
C("iv_cripta_volta","","Você volta outro dia, e outro. Elmo está sempre lá. A escada da cripta parece esperar você.",["Descer mesmo assim",0,0,0,0,{die:"cripta"}],["Perguntar a Velasco sobre a cripta",4,0,0,0,{nx:"iv_cripta2"}]);
C("iv_cripta2","Velasco","Você pergunta ao bispo sobre os horários da Sé. 'As vésperas são ao pôr do sol. Até os mais estranhos dos fiéis vão.' Elmo nunca falta à missa.",["Descer à cripta durante as vésperas",4,0,0,0,{set:"desceu"}],["Ir à missa e escapar no meio do salmo",8,0,0,0,{set:"desceu"}]);
C("iv_tumulo","","Na cripta, entre os reis antigos, há um túmulo pequeno, sem flores: 'Infante Dom Pedro, filho de Aires, morto aos doze anos.' A tampa foi aberta. Está vazio.",["Olhar dentro do túmulo",0,0,0,0,{set:"tumulo"}],["Sair antes que alguém chegue",0,0,0,0,{set:"tumulo"}],{req:"desceu",once:1});
C("iv_violante","Violante","O infante Pedro? Sumiu num naufrágio há doze anos. A rainha era pequena. Engraçado: ela nunca fala dele. Nem uma vez. Como se não lembrasse.",["Perguntar mais sobre Pedro",0,0,0,0,{set:"pedro"}],["Agradecer e sair",0,0,0,0,{set:"pedro"}],{req:"tumulo",once:1});
C("iv_pergunta","Isolda","No jantar, com Duarte à mesa por ordem do conselho, Isolda pergunta por que você está tão calado.",["Perguntar se ela tem um irmão",0,0,0,0,{die:"elmo_pergunta"}],["Dizer que está cansado",0,0,0,0],{req:"pedro",once:1});
C("iv_elmo_revela","Elmo","Elmo tira o elmo pela primeira vez. Metade do rosto é cinza, como papel queimado. 'Eu sou Pedro. Depois do naufrágio, usei a sua ampulheta por anos, mil vezes, tentando voltar para casa. Quando cheguei, minha irmã já não lembrava de mim. A ampulheta dela me apagou da memória dela.'",["'A ampulheta dela?'",0,0,0,0,{nx:"iv_verdade"}],["Abraçar o homem sem rosto",0,0,0,0,{nx:"iv_verdade"}],{req:"pedro",once:1});
C("iv_verdade","Elmo","São duas, escrivão. A sua e a dela. Quando um de vocês morre, as duas viram. Isolda vive este ano desde o funeral do pai. Já viveu trezentas e doze vezes. Eu entreguei a minha ao abade de Alvor, e ela pediu que ele achasse alguém digno. Achou você. E quem já carregou uma ampulheta nunca mais esquece as voltas. Por isso eu lembro.",["Ir falar com a rainha",0,0,0,0],["Sentar no chão da cripta e respirar",0,0,0,0]);
C("iv_isolda","Isolda","Isolda tira do decote uma ampulheta igual à sua. 'Trezentas e doze vezes. Eu esqueci minha mãe, meu irmão, a cor do mar. Sozinha, eu sempre perdia no outono. Com você, chegamos mais longe do que nunca.'",["Perguntar por que não contou",0,0,4,0],["Perguntar quantas vezes ele já a conheceu",0,0,4,0,{nx:"iv_isolda2"}],{req:"pedro",once:1});
C("iv_isolda2","Isolda","Para você, nos conhecemos em março. Para mim, você já me salvou cento e quatro vezes. E morreu na minha frente outras tantas. Eu lembro de todas.",["Segurar a mão dela",0,0,6,0],["Ficar em silêncio",0,0,0,0]);
C("iv_contar","Elmo","Pedro pede uma coisa só: 'Quando tudo acabar, diga a ela quem eu sou. Ela não vai lembrar. Mas vai saber.'",["Prometer contar",0,0,0,0,{set:"promessa_pedro"}],["Dizer que isso só vai machucá-la",0,0,0,0]);
P(4,"iv_p1","Velasco","As relíquias da Sé foram roubadas durante a febre. O bispo quer revistar o Beco Fundo.",["Permitir a revista",8,-8,0,0],["Negar a revista",-8,6,0,0]);
P(4,"iv_p2","Constança","Alcarra quer cobrar a dívida da Peste agora, com juros.",["Pagar metade agora",0,0,4,-10],["Pedir mais um ano",0,0,-4,4]);
P(4,"iv_p3","Catarina","Os nobres querem o julgamento de Duarte público, na praça.",["Julgamento público",0,8,-6,0],["Julgamento fechado",0,-6,8,0]);
P(4,"iv_p4","Guiomar","Os órfãos da Peste dormem na rua. O povo pede um abrigo.",["Abrir um abrigo no palácio velho",0,10,-4,-6],["Pedir que os conventos recebam",6,-4,0,0]);
P(4,"iv_p5","Florian","Os médicos de Bravânia querem ensinar o que sabem. O bispo diz que é saber pagão.",["Abrir uma escola de médicos",-10,6,0,-4],["Mandar os médicos embora",8,-4,0,4]);
P(4,"iv_p6","Afonso","A guarda quer o soldo atrasado da Peste.",["Pagar o soldo",0,0,6,-10],["Pagar com terras do regente preso",0,0,-6,4]);
P(4,"iv_p7","Velasco","O bispo quer coroar a rainha ele mesmo, na Sé. Os nobres querem a coroação no palácio.",["Coroação na Sé",10,4,-10,0],["Coroação no palácio",-10,0,10,0]);
P(4,"iv_p8","Constança","Um mercador quer o monopólio do sal em troca de um presente generoso.",["Aceitar o presente",0,-8,0,10],["Recusar",0,4,0,-4]);
P(4,"iv_p9","Leonor","Leonor pede para deixar a corte. 'Não consigo mais olhar para a minha senhora.'",["Deixá-la ir com uma pensão",0,4,0,-6],["Pedir que fique pela rainha",0,0,4,0]);
P(4,"iv_p10","Guiomar","O povo quer festa de colheita, mesmo com tanta gente morta.",["Fazer a festa",-4,10,0,-6],["Fazer uma missa pelos mortos",8,-4,0,0]);

/* ---------- ATO V ---------- */
C("v_manha","Isolda","A coroa está na almofada, e as duas ampulhetas estão na mesa, lado a lado. A areia das duas cai no mesmo ritmo. 'Hoje termina o ano, {N}. Para nós dois.'",["Perguntar o que acontece depois",0,0,0,0],["Ajeitar a coroa nas mãos dela",0,0,4,0],{once:1});
C("v_duarte_volta","Afonso","Notícia da fronteira: Duarte voltou, com mercenários e o selo do regente. Diz que a coroação é ilegal e marcha para Valcorte.",["Fechar os portões e coroar mesmo assim",0,-4,6,-6],["Mandar Catarina e os nobres ao encontro dele",0,0,-6,0],{req:"duarte_fugiu",once:1});
C("v_pedro","Elmo","Pedro espera no fundo da Sé, de elmo. 'Você vai contar a ela?'",["Contar a Isolda quem ele é",0,0,0,0,{set:"contou",nx:"v_pedro2"}],["Pedir que ele mesmo conte",0,0,0,0]);
C("v_pedro2","Isolda","Isolda olha para o homem de elmo por muito tempo. 'Eu não lembro de você.' Ela segura a mão dele. 'Mas minha mão lembra.'",["Deixar os dois a sós",0,4,0,0],["Ficar ao lado deles",0,0,4,0]);
C("v_escolha","Isolda","Se quebrarmos as duas, nunca mais voltamos. Se você morrer, morre. Se eu errar, errei. Mas também nunca mais esquecemos nada. O que você quer?",["Quebrar as ampulhetas, juntos",0,0,0,0,{brk:1,set:"quebrou"}],["Guardar as ampulhetas, por segurança",0,0,0,0,{end:"eterno"}],{once:1});
C("v_s1","Velasco","Sem ampulheta e sem volta. O bispo exige jurar a coroa sobre a Bíblia e as relíquias, diante do povo. Os nobres querem jurar sobre a espada do rei.",["Jurar sobre a Bíblia",8,4,-8,0],["Jurar sobre a espada",-8,0,8,0],{req:"quebrou"});
C("v_s2","Constança","Constança apresenta a conta da coroação: dez mil moedas. 'Alcarra pode perdoar metade, se o porto ficar livre de impostos.'",["Aceitar a troca",0,-6,0,8],["Pagar tudo do tesouro",0,4,0,-12],{req:"quebrou"});
C("v_s3","Guiomar","A praça está cheia. O povo quer que a rainha atravesse a multidão a pé, sem guarda.",["A rainha vai a pé",0,10,-6,0],["A rainha vai a cavalo, com a guarda",0,-6,6,0],{req:"quebrou"});
C("v_s4","Catarina","Os nobres pedem um lugar no conselho novo da rainha. Todos eles.",["Dar três lugares aos nobres",0,-4,8,0],["Dar um lugar a cada voz: Fé, Povo, Nobreza e Tesouro",4,4,-4,4],{req:"quebrou"});
C("v_coroa","Isolda","O sino toca. O bispo levanta a coroa. Isolda procura o seu rosto na multidão antes de qualquer outro.",["Sorrir de volta",0,0,0,0,{end:"auto"}],["Fazer a reverência mais desajeitada do reino",0,0,0,0,{end:"auto"}],{req:"quebrou"});

/* ---------- cartas de equilíbrio (aparecem quando um medidor está perto do fim) ---------- */
B("b_f0",[0,"lo"],"Velasco","O bispo anda dizendo que o escrivão não pisa na igreja há semanas.",["Ir à missa e doar velas",10,0,0,-4],["Ignorar o bispo",-4,2,0,0]);
B("b_f1",[0,"hi"],"Catarina","Os nobres reclamam que a Igreja manda mais que a coroa.",["Tirar um privilégio do bispo",-10,0,4,0],["Deixar como está",2,0,-4,0]);
B("b_p0",[1,"lo"],"Guiomar","O povo cospe quando a carruagem da rainha passa.",["Distribuir pão na praça",0,10,0,-6],["Dobrar a guarda",0,-4,4,0]);
B("b_p1",[1,"hi"],"Catarina","O povo canta o seu nome nas tavernas. Os nobres não gostam de canções.",["Pedir aos arautos que elogiem a rainha, não você",0,-10,4,0],["Aproveitar a fama",0,4,-6,0]);
B("b_n0",[2,"lo"],"Catarina","Os nobres se reúnem sem convidar a coroa. Mau sinal.",["Oferecer um banquete aos nobres",0,-2,10,-6],["Fingir que não sabe",0,0,-4,0]);
B("b_n1",[2,"hi"],"Guiomar","Os nobres pedem mais terras. O povo diz que a rainha virou dama de companhia deles.",["Negar as terras",0,4,-10,0],["Dar as terras",0,-6,4,0]);
B("b_t0",[3,"lo"],"Constança","Os cofres estão quase vazios. Alcarra oferece um empréstimo rápido.",["Aceitar o empréstimo",0,0,-2,12],["Cortar as festas da corte",0,-2,-4,6]);
B("b_t1",[3,"hi"],"Guiomar","Os cofres transbordam e o povo sabe. 'Onde está o nosso pão?'",["Abrir os celeiros e baixar impostos",0,8,0,-12],["Guardar para o inverno",0,-4,0,2]);

/* ---------- finais ---------- */
var ENDS={
 lembra:["A Rainha que Lembra","Isolda é coroada sem ampulheta, sem volta e sem esquecer. Duarte apodrece na torre. O homem de elmo agora se chama Pedro de novo, e ensina a irmã a lembrar da mãe, contando uma história por noite.\n\nVocê volta a copiar livros. Na primeira página de cada um, escreve a data: 1º de novembro de 1348. O dia em que o tempo voltou a andar para a frente."],
 meia:["Meia Lembrança","Isolda é coroada, e o reino respira. O homem de elmo assiste do fundo da Sé e vai embora antes do banquete. Ninguém conta a ela quem ele era.\n\nÀs vezes, a rainha para no meio de uma frase e olha para a porta, como quem espera alguém que nunca conheceu."],
 cinzas:["A Coroa de Cinzas","Isolda é coroada com Duarte às portas, e a primeira guerra do reinado começa na mesma semana. Sem ampulheta, cada morte agora é para sempre.\n\nVocê escreve as ordens de batalha de uma rainha que já perdeu trezentas e doze vezes. Desta vez, ela diz, vai ser diferente. Você acredita, porque precisa."],
 eterno:["O Próximo Elmo","Vocês guardam as ampulhetas, por segurança. No inverno, algo dá errado, e a areia vira. E vira de novo. E de novo.\n\nAnos depois, um homem de elmo fechado senta numa taverna de Valcorte diante de um copista recém-chegado de Alvor. 'Não deixe a rainha ir à Porta do Rio', ele diz. Ele já não lembra o próprio nome."],
 sem:["Sem Retorno","As ampulhetas estão quebradas, e você caiu no último dia. Isolda é coroada mesmo assim, com um lugar vazio ao lado do trono.\n\nEla não esquece. Agora, ela nunca mais esquece nada."]
};

var BEATS={
 1:["i_chega","i_rainha","i_tut1","i_duarte","i_banquete","i_cozinha","i_bispo","i_violante","i_leonor","i_conselho"],
 2:["ii_navios","ii_florian","ii_porta","ii_flagelantes","ii_elmo","ii_violante","ii_fim"],
 3:["iii_frota","iii_isolda","iii_duarte","iii_catarina","iii_constanca","iii_valerio","iii_forjada","iii_noite","iii_flagra","iii_frota_sai","iii_duarte_cela","iii_fugiu"],
 4:["iv_esquece","iv_elmo","iv_cripta","iv_tumulo","iv_violante","iv_pergunta","iv_elmo_revela","iv_isolda","iv_contar"],
 5:["v_manha","v_duarte_volta","v_pedro","v_escolha","v_s1","v_s2","v_s3","v_s4","v_coroa"]
};
