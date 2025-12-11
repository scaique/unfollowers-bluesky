"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faBlogger } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '@/components/UserInfo';
import Unfollowers from '@/components/Unfollowers';
import Carregando from '@/components/Carregando';
import ComoUsar from '@/components/ComoUsar';
import { recuperarLocalStorage, salvarLocalStorage } from '@/utils/utils';
import Principal from '@/components/Principal';

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const [buttonWidth, setButtonWidth] = useState("100%");
  const [showUnfollowButton, setShowUnfollowButton] = useState(false);
  const [users, setUsers] = useState([]);
  const [savedUsers, setSavedUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [unfollowers, setUnfollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const apagarLocalStorage = () => {
    localStorage.removeItem("users");
    setSavedUsers([]);
    setShowUnfollowButton(false);
  };

  const salvarUser = (handle) => {
    let users = recuperarLocalStorage("users") || [];
    if (!users.includes(handle)) {
      users.push(handle);
    }
    salvarLocalStorage("users", users);
    setSavedUsers(users);
  };

  // Effects
  useEffect(() => {
    const saved = recuperarLocalStorage("users");
    if (saved) setSavedUsers(saved);
  }, []);

  useEffect(() => {
    if (selectedValue === "") {
      setButtonWidth("100%");
      setShowUnfollowButton(false);
    } else {
      setButtonWidth("49%");
      setShowUnfollowButton(true);
    }
  }, [selectedValue]);

  // API functions
  const getProfile = async (handle) => {
    try {
      const response = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`
      );
      return await response.json();
    } catch (error) {
      console.error("Erro ao recuperar perfil:", error);
      return null;
    }
  };

  const fetchAllData = async (url, cursor) => {
    let allData = [];
    let cursorNext = cursor;
    
    do {
      const response = await fetch(
        `${url}${cursorNext ? `&cursor=${cursorNext}` : ""}`
      );
      const data = await response.json();
      allData = [...allData, ...(data.followers || data.follows)];
      cursorNext = data.cursor;
    } while (cursorNext);

    return allData;
  };

  const findUnfollowers = async (handle) => {
    setLoading(true);
    try {
      const followers = await fetchAllData(
        `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers?actor=${handle}&limit=100`,
        null
      );
      
      const follows = await fetchAllData(
        `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollows?actor=${handle}&limit=100`,
        null
      );

      const unfollowers = follows.filter(follow => 
        !followers.some(follower => follower.did === follow.did)
      );

      return unfollowers;
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleBuscarUsers = async () => {
    const query = document.getElementById("user").value;
    if (!query) {
      alert("Por favor, insira um nome de usuário para realizar a busca.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${query}&limit=100`
      );
      const data = await response.json();
      setUsers(data.actors);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNotFollowingBack = async () => {
    if (!selectedValue) {
      alert("Por favor, selecione um usuário.");
      return;
    }

    const profile = await getProfile(selectedValue);
    setUserInfo(profile);

    const unfollowers = await findUnfollowers(selectedValue);
    setUnfollowers(unfollowers);
    salvarUser(selectedValue);
  };

  return (
    <div className="font-sans bg-primario text-primario m-0 p-0 flex flex-col items-center justify-center min-h-screen">
      <Principal 
        selectedValue={selectedValue} 
        setSelectedValue={setSelectedValue} 
        buttonWidth={buttonWidth} 
        showUnfollowButton={showUnfollowButton} 
        users={users} 
        savedUsers={savedUsers} 
        handleBuscarUsers={handleBuscarUsers} 
        handleNotFollowingBack={handleNotFollowingBack} 
        apagarLocalStorage={apagarLocalStorage} 
      />

      {userInfo && (
        <UserInfo user={userInfo} />
      )}

      {unfollowers.length > 0 && (
        <Unfollowers unfollowers={unfollowers} />
      )}

      {loading && <Carregando />}

      <ComoUsar show={showHowTo} onClose={() => setShowHowTo(false)} />
      
      <button onClick={() => setShowHowTo(!showHowTo)} className="fixed cursor-pointer bottom-3 right-3 bg-secundario hover:bg-secundario-escuro text-primario p-2 px-5 rounded-full text-md shadow-lg transition-colors" >
        {showHowTo ? 'Fechar' : 'Como Usar'}
      </button>
    </div>
  );
}