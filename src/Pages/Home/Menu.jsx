import { useState } from "react";
import { LeftBar } from "./LeftBar";
import { CustomView } from "./CustonView";
import "/css/Menu/Menu.css";

export const Menu = () => {
    const [selected, setSelected] = useState("inicio");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="menu-container">
        {/* Botón hamburguesa solo visible en móviles */}
        <button 
            className="hamburger-btn" 
            onClick={toggleSidebar} 
            aria-label="Abrir menú"
        >
            ☰
        </button>

        {/* Sidebar recibe estado para mostrar o ocultar */}
        <LeftBar 
            onSelect={(item) => {
            setSelected(item);
            setSidebarOpen(false); // cerrar sidebar al seleccionar en móvil
            }} 
            selected={selected} 
            isOpen={sidebarOpen}
        />
        
        <CustomView selected={selected} />
        </div>
    );
};
