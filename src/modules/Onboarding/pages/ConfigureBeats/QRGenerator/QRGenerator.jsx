import React from 'react';
import QRCode from 'qrcode.react';
import "./QRGenerator.scss"

const QRGenerator = ({ text }) => {
    // console.log(<QRCode/>)
    return (
        <>
            <div className="qrcode-container">
                {{ text } && <QRCode value={text} size={220} fgColor="#008080"
                    style={{ color: "red", margin: "0 auto" }} />}
            </div>
            {/* {console.log(<QRCode/>)} */}
        </>
    );
}

export default QRGenerator;
