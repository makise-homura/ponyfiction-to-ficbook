// ==UserScript==
// @name        Ponyfiction to Ficbook Export
// @version     0.3.2
// @description Экспорт открытой страницы понификшена в виде текста для заливки на фикбук
// @include     http*://ponyfiction.org/story/*
// @author      makise_homura
// @icon        https://www.google.com/s2/favicons?domain=ponyfiction.org
// @grant       none
// ==/UserScript==

if(document.querySelectorAll('div.chapter-text-block').length > 0)
{
    // Do it for every chapter on a page, then join the results with astericks block
    var text = Array.from(document.querySelectorAll('div.chapter-text-block')).map(obj =>
    {
      var txt = obj.innerHTML;

      // Remove newlines
      txt = txt.replaceAll('\n','');

      // Remove headers
      txt = txt.replaceAll(/<h2>.*<\/h2>/g,'');

      // Replace <hr> with astericks
      txt = txt.replaceAll('<hr>','\n<center>* * *</center>\n');

      // Replace spaces at the start of the line
      txt = txt.replaceAll(/^\s*/g,'');

      // Replace nbsps and other html-entities
      var ta = document.createElement('textarea');
      ta.innerHTML = txt;
      txt = ta.value;

      // Change bold text
      txt = txt.replaceAll('</strong>','</b>').replaceAll('<strong>','<b>');

      // Change italic text
      txt = txt.replaceAll('</em>','</i>').replaceAll('<em>','<i>');

      // Add newlines back at the end of paragraphs and in the line breaks
      txt = txt.replaceAll('</p>','\n').replaceAll('<br>','\n')

      // Remove next chapter links
      txt = txt.replaceAll(/<p class=\"next-chapter-link\">(.*)/g,'');

      // Change right-aligned paragraphs to right-block
      txt = txt.replaceAll(/<p align=\"right\">(.*)/g,'<right>$1</right>');

      // Change centered paragraphs to center-block
      txt = txt.replaceAll(/<p align=\"center\">(.*)/g,'<center>$1</center>');

      // Change all other paragraphs to tabs
      txt = txt.replaceAll('<p>','<tab>');

      // Replace unnecessary tag reopenings
      txt = txt.replaceAll('</right>\n<right>','\n').replaceAll('</center>\n<center>','\n').replaceAll('</b>\n<b>','\n').replaceAll('</i>\n<i>','\n');

      return txt;
    }).join('\n<center>* * *</center>\n');

    // Create a link and allow download
    chaptername = document.title.replace(' — Библиотека ponyfiction.org','');
    var link = document.createElement('a');
    link.setAttribute('data-noajax', '1');
    link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', chaptername + '.txt');
    document.querySelector(".more-info").childNodes.forEach(p =>
    {
        if(p.textContent.match("Скачать"))
        {
            p.append(", ");
            p.after(link);
        }
    });
}