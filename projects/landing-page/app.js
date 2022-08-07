/**
 * Global variables: 
 *  ul element to store links and then be appended to nav
 *  sections list to store the section elements of the page to dynammically populate nav with them
 *  nav bar to select the nav element
 */

const unordered_list = document.createElement("ul");
const sections_list = document.querySelectorAll("section");
const nav_bar = document.querySelector("nav")

/**
 * checks if the element sent in arguments is in viewport or not.
 * @param {*} current_element 
 * @returns true or false depending on the if condition
 */
function viewPortCheck(current_element){
    const window_height = window.innerHeight;
    const currentvwp = current_element.getBoundingClientRect(); 
    if(
        (0 <= currentvwp.y && currentvwp.y <= window_height / 2) ||
        (currentvwp.bottom <= window_height && currentvwp.bottom >= window_height / 2)
)
        return true;
    return false;
}


function buildNav() {    
    /** 
     * I created an unordered list element and appended to it li elements wrapping anchor elements for each section, 
     * then i appended the list to the document
     * i could have made this using DocumentFragment, however it wasn't necessary because i only appended the list after it was
     * fully ready so the number of reflow and repaint didn't increase and creating a DocumentFragment would have 
     * consumed more space
    */ 
    for (const section of sections_list) {
        const new_li = document.createElement("li");
        const new_anchor = document.createElement("a");
        new_anchor.textContent = section.getAttribute("data-nav");
        new_anchor.href = "#" + section.id;
        new_li.appendChild(new_anchor);
        new_li.style.padding = "20px";
        unordered_list.appendChild(new_li);
    }
    nav_bar.appendChild(unordered_list);   
}


function scrollingFunction(evt) {
    /**
     * first we cancel the default action of clicking the anchor element  
     * The clicking on anchor elements is captured by event delegation since the event is received on the nav
     * so we use preventDefault on the event received by the nav
     * 
     * then we get the href of the anchor element clicked on, and we use scrollIntoView to scroll to the section with that specific id
     * (anchor element href = section id)
     */
    evt.preventDefault();
    if(evt.target.nodeName == 'A') // this is to ensure that the click was on the link not the rest of the li 
    {
        const destination = evt.target.getAttribute("href");
        document.querySelector(destination).scrollIntoView({'behavior':'smooth'});
    }
}

/**
 * Since (anchor elements href = corresponding section id)
 * we receive the section id and loop over all anchor elements to find the one with the same href then the specific li 
 * containing that anchor is added to a new class "activeNavLink" and every other li item is removed from that class
 */

function makeNavLinkActive(section_id){
    for(const li of unordered_list.childNodes){
        const a_href = li.querySelector("a").getAttribute('href');
        if (a_href == "#" + section_id){
            li.classList.add("activeNavLink");
        }
        else {
            li.classList.remove("activeNavLink");
        }
    }
}

/**
 * First we check if we are at the top of the page/header by using window.scrollY, if so then there can't be any
 * highlighted nav link so we send null to the makeNavLinkActive function
 * 
 * Second we go through each section and call for the (viewPortCheck) function to check if section is in viewport
 * if so we add section to the "your-active-class" section and we call the makeNavLinkActive function to send it the id
 * of that specific section to make its nav link highlighted also
 * 
 * Third, since this function is a listener function to the scrolling event on the document, we also look out for when
 * we have passed 1/4 of the page so we can display the go to top button
 * so we call for displayButtonGoToTop() function
 * 
 */
function makeSectionActive(){

    if(window.scrollY == 0)
        makeNavLinkActive(null);

    for(const section of sections_list){
        if (viewPortCheck(section)){
            section.classList.add("your-active-class");
            makeNavLinkActive(section.getAttribute('id'));
        }
        else {
            section.classList.remove("your-active-class");
        }
    }
    displayButtonGoToTop();
}

function displayButtonGoToTop(){
    const button = document.querySelector("button");
    if(window.scrollY >= document.body.clientHeight / 4)
        button.style.display = "inline-block";
    else button.style.display = "none";
}

/**
 * This function is called by the button in the html.
 */
function goToTop(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
}

/**
 * We have event listeners for:
 * 
 *  as soon as DOMContentLoaded event is received by document we build the nav
 * 
 *  as soon as scroll event is received by document we call for makeSectionActive which leads to:
 *      1. highlighting section
 *      2. highlighting nav bar link
 *      3. checking if go to top button should appear or not
 *  
 *  as soon as click event is received by the nav element due to clicking on any of its children(event delegation) we
 *  call for scrollingFunction to prevent default action and go for a smooth scroll
 */
document.addEventListener('DOMContentLoaded', buildNav);

nav_bar.addEventListener('click', scrollingFunction);

document.addEventListener('scroll', makeSectionActive)
