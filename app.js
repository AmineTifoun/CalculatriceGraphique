/*MANIPULATION DES BOUTONS */
const bouttons = [...document.getElementsByTagName("button")];
const calculatrice = document.getElementsByClassName("myCalculate")[0];
const keys = bouttons.map((boutton) => boutton.dataset.val);
var touches = document.getElementsByClassName("touches")[0]; /* DATAKEY CONTIENT LE KEY CODE DU CLAVIER POUR LA SAISIE A LAIDE DU CLAVIER*/
/*MANIPUALTION DU CONTENU ECRAN*/
const screen = document.getElementsByClassName("screen")[0];
var smallscr = false; /* VARIABLE D"AFFICHAGE DU PETIT ECRAN POUR LA SAISIE GRAPHIQUE*/
var content = screen.textContent; /* contenu du petit ecran du mode graphique */
/* update function variables */
var creat = 1; /* VARIABLE AUTORISANT L"EMPILEMENT DES BALSIE <P> LORS DE LAFFICHAGE OPPERATIONNEL */
var div = null; /* ligne a empiler dans lecran pour avoir lhistorique */
var long = 0;
var result; /* long = longueur de textContent , result = le resultat des calculs */
var formule; /* variable contenant les formules mathemaiques */
var inx; /* indexe d ^ pour voir si la formule puissance est bonne ou non */
var expression;
var E;/* objet contenant la fonction a imprimer */
var num1;
var expr;/* expr arithmetique */
var x; /* function repere */
var ord;/* ordonnée*/
var abc; /*abscisse*/
var i;/* iterateur*/
var angle; /* calcul de langle pour les fonctions triangulaire */
var y;/* position de l'ordonnée*/
var pattern; /*filtre de recherche du nom de fonctions */
var coeff; /* coefficient de ma formule polynomiale*/
/*MANIPULATION DES MODE GRAPHIQUE */
var boutonGraphique = [...document.querySelectorAll(".function")];
const keygraphique = boutonGraphique.map((boutton) => boutton.dataset.val);
var cnv = document.getElementsByTagName("canvas")[0];
var ctx = cnv.getContext("2d"); /* CANAVS  AVEC LE MEME CSS DE L"ECRAN*/
var width = cnv.width;
var height = cnv.height;
var tabAbscisse = []; /* Tableau pour les abscisse */
var tabOrdo = []; /* tableau pour les ordonnés*/
var isGraph = false; /*MODE GRAPHIQUE DEASCTIVE*/
var unite = 30; /* TAILLE DE LUNITE PAR DEFAUT = 30PX*/
var ecart = unite; /* dans la fonction repere*/
var functionAff = []; /* tableau engolbant des fonction deja inseré sur l"ecran cela sert bcp dans le delete du dernier graph */
/****************************************************************************************************************** */

function ifFloat(c) {
    /* VERIFIE SI FLOAT */
    const fl = parseInt(c);
    if (fl.toString() === c) {
        return 0;
    } else {
        return 1;
    }
}

function empiler(o) {
    /* EMPLIMENT LORS DE L"AFFICHAGE OPPPERATIONNEL */
    const elem = document.createElement("p");
    elem.textContent = o;
    screen.appendChild(elem);
    creat = 1;
}

function update(c) {
    /* FONCTION DE GESTION DE SAISIE ET DE RESULTAT (PRINCIPALE)*/
    if (!isGraph && c !== "8") {
        if (
            creat === 1 &&
            c !== "46" &&
            c !== "13" &&
            c !== "^" &&
            c !== "sqrt" &&
            c !== "lp+" &&
            c !== "lp-"
        ) {
            /* LACEMENT DU NOUVEL EMPILEMENT DE LA BALISE P POUR GERER LHISTORIQUE DAFFICHAGE */
            div = document.createElement("p");
            div.textContent = bouttons[keys.indexOf(c)].textContent;
            screen.appendChild(div);
            if (screen.childNodes.length === 9) {
                /* GESTION D"AFFICHAGE*/
                screen.removeChild(screen.childNodes[0]);
                screen.removeChild(screen.childNodes[0]);
            }
            creat = 0; /* ARRET DEMPILEMENT DE BALISE */
            long = 0; /*1ERE ESCPACE LIBRE POUR ACCEUILLIR UN CARACTERE */
            return;
        }
        div = screen.childNodes[screen.childNodes.length - 1]; /* reprise de lancienne balise p*/
        content = div.textContent;
        long = screen.childNodes.length - 1; /* derniere position libre */
    }
    if (
        smallscr === true &&
        c !== "8" &&
        c !== "46" &&
        c !== "13" &&
        c !== "lp-" &&
        c !== "lp+" &&
        c !== "^"
    ) {
        /* DANS LE CAS OU SMALLSCREEN EST "ON" JAI PLUS BESOIN DE TRACER LES FONCTIONs REFERENCE MAIS PLUTOT UTILISER CES BOUTONS POUR ECRIRE LE NOM DES FONCTIONS DANS LA FORMULE POUR QUIL SOIENT TRAITES APRES */
        screen.textContent += bouttons[keys.indexOf(c)].textContent;
        return;
    }
    switch (c) {
    case "13":
        /* traitement des formule*/
        if (!isGraph) {
            formule = screen.childNodes[long].textContent; /* AFFICHAGE OPERATIONNEL*/
        } else {
            formule = screen.textContent; /* AFFICHAGE DES FORMULES GRAPHIQUEs */
        }/* fin de traitement*/
        inx = formule.indexOf("^");
        if (isGraph) {
            /*  CAS DECRITURE DE FORMULE GRAPHIQUE */
            if (formule.slice(0, 5) === "F(x)=") {
                /* formule graphique [si cest celle d"un formule graphique alors elle commencera par F(X)= sinon COEFF si celle des polynome]*/
                expression = formule.slice(5, formule.length);
                fx(expression, unite);
                E = {
                    /* CELA POUR INSERER LA FONCTION SAISIE DANS LE TABLEAU DES FONCTIONS GRAPHIQUES */
                    f: function () {
                        fx(expression, unite);
                    }
                };
                expression = "";
                functionAff.push(E);
                creat = 0;
                break;
            } else {
                /*formule Polynomiale*/
                expression = formule.slice(7, formule.length);
                E = {
                    /* CELA POUR INSERER LA FONCTION POLYNOMIALE SAISIE DANS LE TABLEAU DES FONCTIONS GRAPHIQUES POUR L'AFFICHER*/
                    f: function () {
                        xn(expression, unite);
                    }
                };
                functionAff.push(E);
                visibilityButtons(isGraph, smallscr);
                break;
            }
        }
        if (inx === -1) {
            /* PAS DE CALCULE DE PUISSANCE */
            try {
                result = eval(formule); /* traitement direct de la formule */
            } catch {
                alert("FORMULE OPERATIONNELLE FAUSSE :  " + formule);
                return;
            }
            if (ifFloat(result)) {
                /* precision fixé a 4 pour les resultat*/
                result = parseFloat(result.toFixed(4));
            }
        } else {
            /* CALCULE DE PUISSANCE */
            num1 = parseFloat(formule.slice(0, inx));
            expr = parseFloat(formule.slice(inx + 1));
            result = Math.pow(num1, expr);
            if (Number.isNaN(result)) {
                alert("FORMULE FAUSSE OPERATIONNELLE:  " + formule);
                return;
            }
        }
        empiler(result);
        break;
    case "8" /* effacer */ :
        ctx.clearRect(0, 0, width, height);
        functionAff = [];
        repere(unite);
        screen.textContent = "";
        creat = 1;
        break;
    case "46":
        if (isGraph) {
            /* effacement mode graphique */
            if (!smallscr) {
                ctx.clearRect(0, 0, width, height);
                functionAff.pop();
                visibilityButtons(isGraph, smallscr);
            }
            screen.textContent = screen.textContent.slice(
                0,
                screen.textContent.length - 1
            );
            break;
        }
        /* effacement mode operationnel */
        content = div.textContent.slice(0, div.textContent.length - 1);
        screen.childNodes[long].textContent = content;
        break;
    case "sqrt":
        if (isGraph) {
            sqrt(unite);
        } else {
            content = parseFloat(
                Math.sqrt(parseFloat(content)).toFixed(4)
            ).toString();
            screen.childNodes[long].textContent = content;
        }
        break;

    case "fx":
        smallscr = true; /* activation de la saisie graphique*/
        visibilityButtons(isGraph, smallscr);
        screen.textContent = "F(x)=";
        break;
    case "^":
        if (isGraph) {
            /* DANS LE MODE GRAPHIQUE LE BOUTON CALCUL DE PUISSANCE DEVIENT CELUI DE LA FONCTION POLYNOMIALE */
            smallscr = true;
            screen.textContent = "";
            visibilityButtons(isGraph, smallscr);
            screen.textContent = "COEFFS:";
            break;
        } else {
            screen.childNodes[long].textContent += "^"; /* MODE OP */
            break;
        }

    case "cos":
        cos(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                cos(unite);
            }
        };
        functionAff.push(E);
        break;
    case "sin":
        sin(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                sin(unite);
            }
        };
        functionAff.push(E);
        break;
    case "tan":
        tan(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                tan(unite);
            }
        };
        functionAff.push(E);
        break;
    case "ln":
        ln(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                ln(unite);
            }
        };
        functionAff.push(E);
        break;
    case "acos":
        acosinus(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                acosinus(unite);
            }
        };
        functionAff.push(E);
        break;
    case "exp":
        exp(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                exp(unite);
            }
        };
        functionAff.push(E);
        break;
    case "asin":
        asin(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                asin(unite);
            }
        };
        functionAff.push(E);
        break;
    case "inv":
        inv(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                inv(unite);
            }
        };
        functionAff.push(E);
        break;
    case "atan":
        arctan(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                arctan(unite);
            }
        };
        functionAff.push(E);
        break;
    case "10^x":
        x10(unite);
        E = {
            /* METTRE DANS LE TABLEAU DE FONCTION POUR MANIPULER L"ENSEMBLE DES GRAPHS SAISIS */
            f: function () {
                x10(unite);
            }
        };
        functionAff.push(E);
        break;
    case "lp+":
        if (isGraph) {
            /* BOUTON DE ZOOM + */
            if (unite < 80) {
                ctx.clearRect(0, 0, width, height);
                unite += 10;
                visibilityButtons(isGraph, smallscr);
            }
        }
        break;
    case "lp-":
        if (isGraph) {
            /* BOUTON DE ZOOM - */
            if (unite > 5) {
                ctx.clearRect(0, 0, width, height);
                if (unite > 10) {
                    unite -= 10;
                } else {
                    unite -= 5;
                }
                visibilityButtons(isGraph, smallscr);
            }
        }
        break;

    default:
        if (!isGraph) {
            screen.childNodes[long].textContent += bouttons[keys.indexOf(c)].textContent; /* SAISIE DANS LECRAN OPERATIONNEL */
        } else {
            screen.textContent += bouttons[keys.indexOf(c)].textContent; /* SAISIE DANS LE PETIT ECRAN */
        }
    }
}

function visibilityButtons(isGraph, smallscr) {
    /* FONCTION PRINCIPALE DU MODE GRAPHIQUE QUI PREND EN CHARGE LAFFICHAGE DE LA CALCULTRICE DANS LE MODE GRAPHIQUE AVEC TOUTES LES MANIPS QUI PUISSENT Y AVOIR SUPPRESSION DE GRAPH ... */
    /* ELLE PREND EN CHARGE MEME LE SWITCH ENTRE GRAPH MODE ET OP MODE */
    if (isGraph === true) {
        boutonGraphique.forEach(function (e) {
            e.classList.remove("invisible");
            e.classList.add("func");
        });
        bouttons[keys.indexOf("sqrt")].classList.add("func");
        bouttons[keys.indexOf("^")].classList.add("func");
        if (smallscr === false) {
            screen.classList.add("invisible");
        } else {
            screen.textContent = "";
            screen.classList.add("petiteecran");
            screen.classList.remove("invisible");
            document.body.classList.add("zoom");
        }
        cnv.classList.remove("invisible");
        cnv.classList.add("graphDim");
        touches.classList.add("ToucheDim");
        repere(unite);
        functionAff.forEach(function (o) {
            /* IMPRESSION DES GRAPHS*/
            o.f();
        });
    } else {
        /* MODE OPERATIONNEL */
        boutonGraphique.forEach(function (e) {
            e.classList.add("invisible");
        });
        screen.classList.remove("invisible");
        cnv.classList.add("invisible");
        cnv.classList.remove("graphDim");
        touches.classList.remove("ToucheDim");
        bouttons[keys.indexOf("sqrt")].classList.remove("func");
        bouttons[keys.indexOf("^")].classList.remove("func");
    }
}

function repere(unite) {
    /* DESSINER LES REPERES */

    /* DESSIN DU REPERE */
    ctx.beginPath(); /* LES ORDONNEES*/
    ctx.strokeStyle = "red";
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.beginPath(); /* LES ABSCISSE*/
    ctx.strokeStyle = "red";
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    /* TEMOINS DE REPERE*/
    ctx.beginPath();

    /* L"AXE DES ABSCISSE */
    ecart = unite;

    for (x = -1; width / 2 - ecart > 0; x -= 1) {
        ctx.fillText(x.toString(), width / 2 - ecart, height / 2 + 10);
        tabAbscisse.unshift(x);
        ecart += unite;
    }
    tabAbscisse.push(0);
    ecart = unite;
    for (x = 1; x < width; x += 1) {
        ctx.fillText(x.toString(), width / 2 + ecart, height / 2 + 10);
        tabAbscisse.push(x);
        ecart += unite;
    }

    /* L"AXE DES ORDONNEES */
    ecart = unite;
    for (x = -1; height / 2 + ecart < height; x -= 1) {
        ctx.fillText(x.toString(), width / 2 - 15, height / 2 + ecart);
        tabOrdo.unshift();
        ecart += unite;
    }
    ecart = unite;
    tabOrdo.push(0);
    for (x = 1; x < width; x += 1) {
        ctx.fillText(x.toString(), width / 2 - 10, height / 2 - ecart);
        tabOrdo.push(x);
        ecart += unite;
    }
    ctx.stroke();
}

function fx(formule, unite) {
    /* DESSIN DE LA FORMULE GRAPHIQUE SAISIE */
    ctx.strokeStyle = "red";
    expression = formule;
    expression = expression.replace(/x/g, "(i)");
    const tabform = [
        "acos",
        "asin",
        "Tan",
        "e",
        "log",
        "atan",
        "Cos",
        "Sin",
        "sqrt"
    ];
    for (x = 0; x < tabform.length; x += 1) {
        pattern = new RegExp(tabform[x], "g");
        switch (tabform[x]) {
        case "e":
            expression = expression.replace(pattern, "Math.exp");
            break;
        case "Cos":
            expression = expression.replace(pattern, "Math.cos");
            break;
        case "Sin":
            expression = expression.replace(pattern, "Math.sin");
            break;
        case "Tan":
            expression = expression.replace(pattern, "Math.tan");
            break;
        default:
            expression = expression.replace(pattern, "Math." + tabform[x]);
        }
    }
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        i = (x - width / 2) / unite;
        try {
            ord = height / 2 - eval(expression) * unite;
        } catch {
            alert("FORMULE FAUSSE GRAPHIQUE  :  " + formule);
            return;
        }
        if (x === 0) {
            ctx.moveTo(x, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }

    ctx.stroke();
}

function cos(unite) {
    ctx.strokeStyle = "blue";
    console.log("graphe de cosinus");
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        y = height / 2 - Math.cos(angle) * unite;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function acosinus(unite) {
    console.log("Graph de arccos(x)");
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        y = height / 2 - Math.acos(angle) * unite;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function asin(unite) {
    console.log("Graph de arcsin(x)");
    ctx.strokeStyle = "green";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        y = height / 2 - Math.asin(angle) * unite;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function sin(unite) {
    console.log("Graph de sinus(x)");
    ctx.strokeStyle = "green";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        y = height / 2 - Math.sin(angle) * unite;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function tan(unite) {
    console.log("Graph de tan(x)");
    ctx.strokeStyle = "black";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        y = height / 2 - Math.tan(angle) * unite;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

function arctan(unite) {
    console.log("Graph de arctan(x)");
    ctx.strokeStyle = "black";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        angle = (x - width / 2) / unite;
        if (angle % (Math.PI / 2) !== 0) {
            y = height / 2 - Math.atan(angle) * unite;
            if (x === 0) {
                ctx.moveTo(angle, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    }
    ctx.stroke();
}

function exp(unite) {
    console.log("Graph de exp(x)");
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        ord = height / 2 - Math.exp(abc) * unite;
        if (x === 0) {
            ctx.moveTo(abc, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

function xn(formule, unite) {
    /* dessin de la fonction polynomiale */
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    coeff = formule.split("_").map((coeff) => parseFloat(coeff)); /* recuperer les coefficients dans un tableau et les transormer en nombre */
    /* le degre = nbcoeff -1 */
    for (x = 0; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        y = 0;
        for (i = 0; i < coeff.length; i += 1) {
            y += coeff[i] * Math.pow(abc, i);
            if (Number.isNaN(y)) {
                alert("FORMULE FAUSSE :  " + formule);
                return;
            }
        }
        ord = height / 2 - y * unite;
        if (x === 0) {
            ctx.moveTo(abc, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

function x10(unite) {
    console.log("Graph de 10^x(x)");
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        ord = height / 2 - Math.pow(10, abc) * unite;
        if (x === 0) {
            ctx.moveTo(abc, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

function inv(unite) {
    /* inv(x)= 1/x */
    console.log("Graph de inv(x)");
    ctx.strokeStyle = "move";
    ctx.beginPath();
    for (x = 0; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        ord = height / 2 - (1 / abc) * unite;
        if (abc === 0) {
            ctx.moveTo(x, ord);
        }
        if (x === 0) {
            ctx.moveTo(0, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

function ln(unite) {
    console.log("Graph de log(x)");
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    for (x = width / 2; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        ord = height / 2 - Math.log(abc) * unite;
        if (x === width / 2) {
            ctx.moveTo(width / 2, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

function sqrt(unite) {
    /* unite est la taille de l"unite */
    console.log("Graph de Sqrt");
    ctx.strokeStyle = "blue";
    /* AINSI ON A LE MM NOMBRE D"Abscisse que d"ordonnée */
    ctx.beginPath();
    for (x = width / 2; x < width; x += 1) {
        abc = (x - width / 2) / unite;
        ord = height / 2 - Math.sqrt(abc) * unite;
        if (x === width / 2) {
            ctx.moveTo(width / 2, ord);
        } else {
            ctx.lineTo(x, ord);
        }
    }
    ctx.stroke();
}

/*************************************/
visibilityButtons(
    isGraph,
    smallscr
); /******************************************** */
document.addEventListener("keydown", function (c) {
    const key = c.keyCode.toString();
    if (keys.indexOf(key)) {
        update(key); /* traitement des saisies du clavier */
    }
    c.stopPropagation();
});
calculatrice.addEventListener("click", function (c) {
    const bouton = c.target;
    const key = bouton.dataset.val || bouton.childNodes[0].data;
    switch (key) {
    case "mod":
    case "Graph":
    case "Op":
        isGraph = !isGraph;
        visibilityButtons(isGraph, smallscr);
        c.target.childNodes[0].textContent = (
            isGraph
            ? "Op"
            : "Graph"
        );
        if (!isGraph) {
            creat = 1; /* autoriser lempilement de la 1ere balise Pour la 1ere saisie*/
            smallscr = false;
            update("8");
            screen.classList.remove(
                "petiteecran"
            ); /* la div screen reprend sa taille normale */
            document.body.classList.remove(
                "zoom"
            ); /* reprendre les dimensions du mode operationnel */
            smallscr = false;
        }
        break;
    default:
        update(key); /* traintement de la donnée cliquée */
    }
    c.stopPropagation();
});

/* FIN  */
/* PENSEZ A LIRE LE MODE D"EMPLOI EN AMANT */