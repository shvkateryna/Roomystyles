import React from "react";

const GroupDetail = ({ headers, rows, groupName, onBack }) => {
  if (!headers.length) {
    return <p>No data to display</p>;
  }
  function extractValue(input) {
    const startIndex = input.indexOf("=") + 1; // Find the index of the first "="
    if (startIndex === 0) return null; // If "=" is not found, return null
    const endIndex = input.indexOf("&", startIndex); // Find the index of the first "&" after the "="
    if (endIndex === -1) return input.substring(startIndex); // If "&" is not found, return the substring from "=" to the end
    return input.substring(startIndex, endIndex); // Return the substring between "=" and "&"
  }
  function check_url(slideImage) {
    if (typeof slideImage != "string") {
      return URL.createObjectURL(slideImage);
    } else {
      return (
        "https://drive.google.com/thumbnail?id=" +
        extractValue(slideImage) +
        "&sz=w1000"
      );

    }
  }
  return (
    <div>
      <button className="return_button" onClick={onBack}>
        {/* <img src=''/> */}
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h2>Room: {groupName}</h2>

      {rows.map((row, rowIndex) => (
        <div class="recordings_wrapper" key={rowIndex}>
          <div class="horizontal_separator"></div>

          {row.slice(1, 4).map((cell, cellIndex) => (
            <>
              {cell == "-" || cell == "" || cell == " " ? (
                <></>
              ) : (
                <div key={cellIndex}>
                  <div className="heading_main">{headers[cellIndex + 1]}</div>
                  <div className="description_main">{cell}</div>
                </div>
              )}
              
            </>
          ))}

          <div className="separator_horizontal_line"></div>
          {row.slice(4).map((cell, cellIndex) => (
            <>
              {cell == "-" ? (
                <></>
              ) : (
                <div key={cellIndex}>
                  <div className="heading_info">{headers[cellIndex + 4]}</div>

                  {cell.indexOf("http") == -1 ? (
                    <>
                      {" "}
                      <div>{cell}</div>
                    </>
                  ) : (
                    <>
                    <div>{cell.slice(0, cell.indexOf("http"))}</div>
                      {cell
                        .slice(cell.indexOf("http"))
                        .split(" ")
                        .map((cell_piece, cellIndex) => (
                          <img src={check_url(cell_piece)} />
                        ))}
                    </>
                  )}
                </div>
              )}
            </>
          ))}
        </div>
      ))}

      {/* <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default GroupDetail;
