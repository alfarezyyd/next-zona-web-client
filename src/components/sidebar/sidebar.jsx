import React from "react";
import {Sidebar} from "./sidebar.styles";
import {Avatar, Tooltip} from "@nextui-org/react";
import {CompaniesDropdown} from "./companies-dropdown";
import {HomeIcon} from "../icons/sidebar/home-icon";
import {ProductsIcon} from "../icons/sidebar/products-icon";
import {ReportsIcon} from "../icons/sidebar/reports-icon";
import {SettingsIcon} from "../icons/sidebar/settings-icon";
import {SidebarItem} from "./sidebar-item";
import {SidebarMenu} from "./sidebar-menu";
import {FilterIcon} from "../icons/sidebar/filter-icon";
import {useSidebarContext} from "../Layout/layout-context";
import {usePathname} from "next/navigation";
import {CategoryIcon} from "@/assets/svg/CategoryIcon";
export const SidebarWrapper = () => {
  const pathname = usePathname();
  const {collapsed, setCollapsed} = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed}/>
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown/>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon/>}
              isActive={pathname === "/"}
              href="/admin"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === "/products"}
                title="Product"
                icon={<ProductsIcon/>}
                href="products"
              />
              <SidebarItem
                isActive={pathname === "/categories"}
                title="Categories"
                icon={<CategoryIcon/>}
                href="categories"
              />

              <SidebarItem
                isActive={pathname === "/transactions"}
                title="Transaksi"
                icon={<ReportsIcon/>}
                href="transactions"

              />
            </SidebarMenu>


          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon/>
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon/>
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
