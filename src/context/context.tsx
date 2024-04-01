'use client'
import { createContext } from 'react';

interface RecipesContext {
  getVideos: () => void,
  getChats: (email: string) => void,
  getNotifications: (email: string) => void,
  showRegister: boolean,
  setShowRegister: (state: boolean) => void,
  showEdit: { show: boolean, video: any },
  setShowEdit: (state: { show: boolean, video: any }) => void,
  showDelete: { show: boolean, video: any },
  setShowDelete: (state: { show: boolean, video: any }) => void,
  showDeleteChat: { show: boolean, chat: any },
  setShowDeleteChat: (state: { show: boolean, chat: any }) => void,
  allChats: any[],
  setAllChats: (state: any[]) => void,
  allVideos: any[],
  setAllVideos: (state: any[]) => void,
  allNotifications: any[],
  setAllNotifications: (state: any[]) => void,
  allFilteredVideos: any[],
  setAllFilteredVideos: (state: any[]) => void,
  listCategories: any[],
  setListCategories: (state: any[]) => void,
}

const initialValue: RecipesContext = {
  getVideos: () => {},
  getChats: () => {},
  getNotifications: () => {},
  showRegister: false,
  setShowRegister: () => {},
  showEdit: { show: false, video: {}},
  setShowEdit: () => {},
  showDelete: { show: false, video: {} },
  setShowDelete: () => {},
  showDeleteChat: { show: false, chat: {} },
  setShowDeleteChat: () => {},
  allChats: [],
  setAllChats: () => {},
  allVideos: [],
  setAllVideos: () => {},
  allNotifications: [],
  setAllNotifications: () => {},
  allFilteredVideos: [],
  setAllFilteredVideos: () => {},
  listCategories: [],
  setListCategories: () => {},
}

const contexto = createContext(initialValue);
export default contexto;