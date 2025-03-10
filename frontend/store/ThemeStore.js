import {create} from 'zustand'
export const ThemeStore=create((set)=>({
    theme:localStorage.getItem("chat-Item")||"coffee",
    setTheme:(themes)=>{
        localStorage.setItem('chat-Item',themes)
        set({themes})
    }

}))