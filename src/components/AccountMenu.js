import * as React from "react";

import { Classes, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Example } from "@blueprintjs/docs-theme";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function MenuExample({
  name,
  signOut,
  handleChangeImg,
  upload,
}) {
  return (
    <Example className="account-menu" options={false}>
      <Menu className={Classes.ELEVATION_1} style={{ textTransform: "none" }}>
        {upload ? (
          <div style={{ textAlign: "center", padding: "4px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <MenuItem href="/mylist/watch" icon="list" text="La tua lista" />

            <MenuDivider />
            <MenuItem href="/mylist/favorite" icon="heart" text="Preferiti" />
            <MenuItem
              href="/mylist/watchlist"
              icon="eye-open"
              text="Watchlist"
            />
            <input
              onChange={handleChangeImg}
              accept="image/*"
              name="files[]"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
            />
            <label htmlFor="raised-button-file" style={{ width: "100%" }}>
              <MenuItem icon="media" text="Aggiorna immagine" />
            </label>
          </>
        )}

        <MenuDivider />
        <MenuItem
          labelElement={<Icon icon="log-out" />}
          text="Esci"
          intent="none"
          onClick={() => signOut()}
        />
      </Menu>
    </Example>
  );
}
