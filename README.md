# Prva laboratorijska vježba

![License](https://img.shields.io/badge/license-CC0%201.0%20Universal-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0-blue.svg)

## Sadržaj
1. [Tema](#tema)
2. [Cilj](#cilj)
3. [Licencija](#licencija)
   - [Opis CC0 1.0 Universal](#opis-cc0-10-universal)
4. [Autor](#autor)
5. [Verzija skupa podataka](#verzija-skupa-podataka)
6. [Jezik skupa podataka](#jezik-skupa-podataka)
7. [Naslov](#naslov)
8. [Datum izrade podataka](#datum-izrade-podataka)
9. [Datum objave podataka](#datum-objave-podataka)
10. [Opis skupa podataka](#opis-skupa-podataka)
   - [1. Club](#1-club)
   - [2. Player](#2-player)
   - [3. Season](#3-season)
11. [Ostalo](#ostalo)


## Tema

Tema laboratorijske vježbe izrada je otvorenog skupa podataka. **Otvoreni podaci** podaci su kojima bilo tko može slobodno pristupiti, koristiti ih i dijeliti.

## Cilj

Cilj ove vježbe je upoznavanje s procesom kreiranja otvorenog skupa podataka te njegovog dijeljenja u obliku javnog git-repozitorija. Za potrebe prve laboratorijske vježbe potrebno je napraviti skup podataka i spremiti taj skup podataka u bazu po izboru.
Postupak izdvajanja podataka u **CSV** i **JSON** formatu mora biti automatiziran skriptom ili shell naredbom.

---

## Licencija

Ova laboratorijska vježba licencirana je pod [**CC0 1.0 Universal (CC0 1.0)**](https://creativecommons.org/publicdomain/zero/1.0/).

### Opis CC0 1.0 Universal

- **Odricanje prava**: Autor se odriče svih svojih prava na ovo djelo širom svijeta. Možete kopirati, modificirati, distribuirati i izvoditi djelo, čak i u komercijalne svrhe, bez potrebe za traženjem dozvole.

- **Nema obveze navođenja autora**: Nema potrebe za davanjem zasluga autoru.

- **Bez jamstva**: Ovo djelo se pruža "kako jest", bez ikakvih jamstava. Creative Commons nije odvjetnička tvrtka i ne pruža pravne usluge; distribucija ovog dokumenta ne stvara odnos odvjetnik-klijent.

Više informacija na [Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/legalcode).

---

## Autor

**Ivan Smiljanić**

## Verzija skupa podataka

**1.0**

## Jezik skupa podataka

**Hrvatski**

## Naslov
Francuska prva nogometna liga

## Datum izrade podataka
25. listopada 2024.

## Datum objave podataka
25. listopada 2024.
---


## Opis skupa podataka

Skup podataka je razvijen u PostgreSQL bazi podataka i obuhvaća informacije o nogometnim klubovima iz prve francuske lige (Ligue 1).
U ovom skupu podataka pohranjeno je ukupno 18 klubova koji sudjeluju u sezoni **2024./2025**.
Podaci uključuju ključne atribute koji se odnose na klubove, igrače te specifične informacije vezane uz odabranu sezonu.

Skup podataka sadrži tri glavne tablice: **Club**, **Player**, i **Season**, koje su međusobno povezane putem identifikatora kluba i sezone.

### 1. Club

Prva tablica u skupu podataka označava klub i sastoji se od sljedećih stupaca:

| **Naziv Stupca**    | **Opis**                         |
|---------------------|----------------------------------|
| **clubid**          | Identifikator kluba              |
| **clubname**        | Ime kluba                        |
| **stadium**         | Stadion kluba                    |
| **location**        | Lokacija kluba                   |
| **establishedyear** | Godina nastanka kluba            |
| **manager**         | Trenutni trener                  |
| **leagueposition**  | Pozicija u ligi                  |
| **wins**            | Pobjede                          |
| **losses**          | Porazi                           |
| **totalplayers**    | Ukupan broj registriranih igrača |
| **seasonid**        | Identifikator sezone             |

### 2. Player

Druga tablica u skupu podataka označava igrača te se sastoji od sljedećih stupaca:

| **Naziv Stupca**       | **Opis**                                      |
|------------------------|-----------------------------------------------|
| **playerid**           | Identifikator igrača                          |
| **playername**         | Ime igrača                                    |
| **position**           | Pozicija igrača                               |
| **age**                | Dob igrača                                    |
| **nationality**        | Nacionalnost                                  |
| **goalsscored**        | Broj golova                                   |
| **assists**            | Broj asistencija                              |
| **matchesplayed**      | Odigrane utakmice                             |
| **clubid**             | Identifikator kluba                           |
| **salary**             | Plaća igrača                                  |

### 3. Season

Treća tablica u skupu podataka označava sezonu te se sastoji od sljedećih stupaca:

| **Naziv Stupca** | **Opis**             |
|------------------|----------------------|
| **seasonid**     | Identifikator sezone |
| **seasonyear**   | Godina sezone        |

---



## Ostalo

Podaci su pohranjeni u **.csv** i **.json** formatu putem shell skripte.
Skripta je napravljena kako bi povukla podatke u odabranim formatima iz baze podataka te se može pokrenuti naredbom `./script.sh`.
