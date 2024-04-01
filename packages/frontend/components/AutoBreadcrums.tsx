import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AutoBreadCrums() {
  const pathname = usePathname();

  const pathItems = pathname.split("/");
  return (
    <Breadcrumbs>
      {pathItems.map((pathItem, i) => {
        const lastItem = i === pathItems.length - 1;
        if (lastItem) {
          <BreadcrumbItem key={pathItem}>{pathItem}</BreadcrumbItem>;
        }
        return (
          <BreadcrumbItem key={pathItem} href={pathItems.filter((_, _i) => _i <= i).join("/")}>
            {pathItem}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
}
