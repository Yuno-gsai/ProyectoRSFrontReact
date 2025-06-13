import React, { useEffect, useState } from "react";
import { useAuthHandlers } from "../../Handles/UserauthHandlers";
import { Publicacion } from "../Publications/Publications";
import { LeftBar } from "../Home/LeftBar";
import "../../../css/Perfil/PerfilView.css";

// Add styles to a style tag in the head
const addLayoutStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Profile close button */
    .profile-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
    }
    
    .profile-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
    }
    
    .main-layout {
      display: flex;
      min-height: 100vh;
      background-color: #121212;
      position: relative;
    }
    
    .profile-container {
      flex: 1;
      padding: 20px;
      margin-left: 250px;
      transition: all 0.3s ease;
      width: calc(100% - 250px);
    }
    
    .section-title {
      color: #e1e8ed;
      margin: 24px 0 16px;
      font-size: 1.5rem;
    }
    
    /* Mobile menu button */
    .menu-toggle {
      display: none;
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 1000;
      background: #1da1f2;
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }
    
    /* Responsive styles */
    @media (max-width: 992px) {
      .profile-container {
        margin-left: 0;
        width: 100%;
        padding: 20px 15px;
      }
      
      .left-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .left-sidebar.open {
        transform: translateX(0);
      }
      
      .menu-toggle {
        display: flex;
      }
    }
    
    @media (min-width: 993px) {
      .left-sidebar {
        transform: translateX(0) !important;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
  return styleElement;
};

export const FriendsPerfil = ({ userid, onClose }) => {
  const { getUserDataById } = useAuthHandlers();
  const [UserData, GetUserData] = useState(null);
  const [selectedNav, setSelectedNav] = useState("inicio");
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  

  // Close sidebar when a navigation item is selected on mobile
  const handleNavSelect = (item) => {
    setSelectedNav(item);
    if (window.innerWidth <= 992) {
      setIsLeftBarOpen(false);
    }
  };

  useEffect(() => {
    const styleElement = addLayoutStyles();
    
    return () => {
      // Clean up the style element when component unmounts
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserDataById(userid);
        if (userData) {
          GetUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    if (userid) {
      fetchData();
    }
  }, [userid, getUserDataById]);

  if (!UserData) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="main-layout">
      
      <div className={`left-sidebar`}>
        <LeftBar 
          selected={selectedNav} 
          onSelect={handleNavSelect}
          isOpen={isLeftBarOpen}
        />
      </div>
      
      <div className="profile-container" onClick={() => window.innerWidth <= 992 && isLeftBarOpen && setIsLeftBarOpen(false)} style={{ position: 'relative' }}>
        <button
          className="profile-close-btn"
          type="button"
          aria-label="Cerrar perfil"
          onClick={onClose}
          title="Cerrar perfil"
        >
          ×
        </button>
        <div className="profile-header">
          <img
            src={
              UserData.foto_perfil
                ? `${UserData.foto_perfil}`
                : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="Foto de perfil"
            className="profile-photo"
          />
          <div className="profile-info">
            <h2>{UserData.nombre_usuario}</h2>
            <p>{UserData.correo}</p>
            <p className="profile-meta">
              Miembro desde: {new Date(UserData.creado_en).toLocaleDateString()}
            </p>
            <div>
              {UserData.biografia || "Biografía no disponible"}
            </div>
          </div>
        </div>



        <h2 className="section-title">Publicaciones</h2>
        <Publicacion userID={userid} />
      </div>
    </div>
  );
};
