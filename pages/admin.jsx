import { useEffect } from "react";

export default function AdminRedirect(){
  useEffect(() => {
    // /admin -> /admin/index.html
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      Admin açılıyor...
    </div>
  );
}
