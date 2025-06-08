export const RightBar = () => {
    return (
        <aside className="right-sidebar">
            <div className="search-box">
                <input type="search" placeholder="Buscar en Tw-like" />
            </div>

            <div className="trends">
                <h3>Tendencias para ti</h3>
                <div className="trend-item">#Tema1</div>
                <div className="trend-item">#Tema2</div>
                <div className="trend-item">#Tema3</div>
            </div>

            <div className="who-to-follow">
                <h3>A quién seguir</h3>
                <div className="follow-item">Usuario1</div>
                <div className="follow-item">Usuario2</div>
                <div className="follow-item">Usuario3</div>
            </div>
        </aside>
    );
};