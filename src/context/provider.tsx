'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
import { getAllVideos } from '@/firebase/video';
import { categories } from '@/categories';
import { getChatsByEmail } from '@/firebase/chat';
import { getNotificationsByEmail } from '@/firebase/notifications';
import { getUserByEmail } from '@/firebase/user';

interface IProvider { children: ReactNode }

export default function Provider({children }: IProvider) {
  const [showRegister, setShowRegister] = useState(false);
  const [showEdit, setShowEdit] = useState({ show: false, video: {} });
  const [showDelete, setShowDelete] = useState({ show: false, video: {} });
  const [showChangePassword, setShowChangePassword] = useState({ show: false, user: {} });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showDeleteChat, setShowDeleteChat] = useState({ show: false, chat: {} });
  const [allFilteredVideos, setAllFilteredVideos] = useState<any[]>([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [allChats, setAllChats] = useState<any[]>([]);
  const [listChats, setListChats] = useState<any[]>([]);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [listCategories, setListCategories] = useState<any>(categories.sort());

  const getVideos = async () => {
    const getVid = await getAllVideos();
    if (getVid) {
      setAllFilteredVideos(getVid);
      setAllVideos(getVid);
      const uniqueCategories: string[] = [];
      getVid.forEach((video: any) => {
        video.categories.forEach((category: any) => {
          if (!uniqueCategories.includes(category)) {
            uniqueCategories.push(category);
          }
        });
      });
      setListCategories(uniqueCategories.sort());
    }
  };

  const getChats = async (email: string) => {
    const getChat = await getChatsByEmail(email);
    if (getChat) {
      setAllChats(getChat);
      setListChats(getChat);
    }
  };

  const getNotifications = async (email: string) => {
    const getNotification = await getNotificationsByEmail(email);
    if (getNotification) setAllNotifications(getNotification);
  };

  return (
    <contexto.Provider
      value={{
        showRegister, setShowRegister,
        showEdit, setShowEdit,
        showDelete, setShowDelete,
        showChangePassword, setShowChangePassword,
        showForgotPassword, setShowForgotPassword,
        showDeleteChat, setShowDeleteChat,
        allChats, setAllChats,
        listChats, setListChats,
        allVideos, setAllVideos,
        allNotifications, setAllNotifications,
        allFilteredVideos, setAllFilteredVideos,
        listCategories, setListCategories,
        getVideos,
        getChats,
        getNotifications,
      }}
    >
      {children}
    </contexto.Provider>
  );
}