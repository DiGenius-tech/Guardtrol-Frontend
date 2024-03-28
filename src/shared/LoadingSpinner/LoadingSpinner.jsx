import React from 'react';
import GuardtrolIconLogo from "../../images/guardtrol-icon-logo.svg"
import GuardtrolNameLogo from "../../images/guardtrol-name-logo.svg"
import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
    return (
        <>
            {/* loading-spinner-app works! */}

            <div id="loading-spinner">
                <div className="img-container">
                    <img src={GuardtrolIconLogo} alt="Icon" />
                    <img src={GuardtrolNameLogo} alt="Guardtrol" />
                </div>
            </div>


        </>
    );
}

export default LoadingSpinner;
