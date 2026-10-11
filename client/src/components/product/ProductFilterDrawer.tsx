import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Filter, X } from "lucide-react";

import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import type { Season } from "../../store/api/productApi";
import type { Product } from "../../types/product";

import "./ProductFilterDrawer.scss";

export interface ProductFilters {
  categoryId?: number;
  season?: Season;
  brand?: string;
}

type FilterGroup = "gender" | "category" | "season" | "brand";

interface ProductFilterDrawerProps {
  filters: ProductFilters;
  products: Product[];
  onApply: (filters: ProductFilters) => void;
  availableFilters?: FilterGroup[];
}

const emptyFilters: ProductFilters = {};

const getFilterCount = (filters: ProductFilters) =>
  Number(filters.categoryId !== undefined) +
  Number(filters.season !== undefined) +
  Number(Boolean(filters.brand));

const ProductFilterDrawer = ({
  filters,
  products,
  onApply,
  availableFilters = ["gender", "category", "season", "brand"],
}: ProductFilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [draft, setDraft] = useState<ProductFilters>(filters);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const { data: categoryData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const categories = (categoryData?.data ?? []).filter(
    (category) => (category._count?.products ?? 0) > 0,
  );
  const genderCategories = categories
    .filter((category) =>
      ["men", "women"].includes(category.category_name.trim().toLowerCase()),
    )
    .sort((a, b) => a.category_name.localeCompare(b.category_name));
  const categoryOptions = categories.filter(
    (category) => !genderCategories.some((gender) => gender.id === category.id),
  );

  useEffect(() => {
    if (!isMounted) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), summary, [tabindex="0"]',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!drawerRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isMounted]);

  const openDrawer = () => {
    setDraft(filters);
    setIsMounted(true);
    setIsOpen(true);
  };

  const closeDrawer = () => setIsOpen(false);

  const handleDrawerAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.currentTarget === event.target && !isOpen) {
      setIsMounted(false);
    }
  };

  const applyFilters = () => {
    onApply(draft);
    closeDrawer();
  };

  const clearFilters = () => {
    setDraft(emptyFilters);
    onApply(emptyFilters);
    closeDrawer();
  };

  const setDraftField = <Key extends keyof ProductFilters>(
    key: Key,
    value: ProductFilters[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const showGender = availableFilters.includes("gender");
  const showCategory = availableFilters.includes("category");
  const showSeason = availableFilters.includes("season");
  const showBrand = availableFilters.includes("brand");
  const brands = Array.from(
    new Set([
      ...products
        .map((product) => (product.brand ?? "").trim())
        .filter(Boolean),
      ...(filters.brand ? [filters.brand] : []),
    ]),
  ).sort((a, b) => a.localeCompare(b));
  const activeCount = getFilterCount(filters);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="product-filter-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openDrawer}
      >
        <Filter size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span
            className="product-filter-trigger__count"
            aria-label={`${activeCount} active filters`}
          >
            {activeCount}
          </span>
        )}
      </button>

      {isMounted &&
        createPortal(
          <div className={`product-filter-layer${isOpen ? "" : " is-closing"}`}>
            <button
              type="button"
              className="product-filter-backdrop"
              aria-label="Close filters"
              onClick={closeDrawer}
            />
            <section
              ref={drawerRef}
              className="product-filter-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-filter-title"
              onAnimationEnd={handleDrawerAnimationEnd}
            >
              <header className="product-filter-drawer__header">
                <div>
                  <span className="product-filter-drawer__eyebrow">
                    REFINE YOUR SELECTION
                  </span>
                  <h2 id="product-filter-title">Filters</h2>
                </div>
                {activeCount > 0 && (
                  <span className="product-filter-drawer__active-count">
                    {activeCount} active
                  </span>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  className="product-filter-drawer__close"
                  aria-label="Close filters"
                  onClick={closeDrawer}
                >
                  <X size={19} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </header>

              <div className="product-filter-drawer__content">
                {showGender && genderCategories.length > 0 && (
                  <details className="product-filter-group" open>
                    <summary>
                      <span>Gender</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="product-filter-options">
                      <label className="product-filter-option">
                        <input
                          type="radio"
                          name="product-filter-gender"
                          checked={
                            !genderCategories.some(
                              (category) => category.id === draft.categoryId,
                            )
                          }
                          onChange={() => {
                            if (
                              genderCategories.some(
                                (category) => category.id === draft.categoryId,
                              )
                            ) {
                              setDraftField("categoryId", undefined);
                            }
                          }}
                        />
                        <span>All</span>
                      </label>
                      {genderCategories.map((category) => (
                        <label
                          className="product-filter-option"
                          key={category.id}
                        >
                          <input
                            type="radio"
                            name="product-filter-gender"
                            checked={draft.categoryId === category.id}
                            onChange={() =>
                              setDraftField("categoryId", category.id)
                            }
                          />
                          <span>{category.category_name}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                )}

                {showCategory &&
                  (categoryOptions.length > 0 ||
                    (categoriesLoading && categories.length === 0)) && (
                    <details className="product-filter-group" open>
                      <summary>
                        <span>Category</span>
                        <ChevronDown size={17} aria-hidden="true" />
                      </summary>
                      {categoriesLoading && categories.length === 0 ? (
                        <p className="product-filter-group__note">
                          Loading categories
                        </p>
                      ) : (
                        <div className="product-filter-options">
                          <label className="product-filter-option">
                            <input
                              type="radio"
                              name="product-filter-category"
                              checked={draft.categoryId === undefined}
                              onChange={() =>
                                setDraftField("categoryId", undefined)
                              }
                            />
                            <span>All categories</span>
                          </label>
                          {categoryOptions.map((category) => (
                            <label
                              className="product-filter-option"
                              key={category.id}
                            >
                              <input
                                type="radio"
                                name="product-filter-category"
                                checked={draft.categoryId === category.id}
                                onChange={() =>
                                  setDraftField("categoryId", category.id)
                                }
                              />
                              <span>{category.category_name}</span>
                              <small>{category._count?.products}</small>
                            </label>
                          ))}
                        </div>
                      )}
                    </details>
                  )}

                {showSeason && (
                  <details className="product-filter-group" open>
                    <summary>
                      <span>Season</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="product-filter-options">
                      {[
                        { label: "All", value: undefined },
                        { label: "Summer", value: "SUMMER" },
                        { label: "Winter", value: "WINTER" },
                        { label: "All season", value: "ALL_SEASON" },
                      ].map((option) => (
                        <label
                          className="product-filter-option"
                          key={option.label}
                        >
                          <input
                            type="radio"
                            name="product-filter-season"
                            checked={draft.season === option.value}
                            onChange={() =>
                              setDraftField(
                                "season",
                                option.value as Season | undefined,
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                )}

                {showBrand && brands.length > 0 && (
                  <details className="product-filter-group d-none" open>
                    <summary>
                      <span>Brand</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="product-filter-options">
                      <label className="product-filter-option">
                        <input
                          type="radio"
                          name="product-filter-brand"
                          checked={!draft.brand}
                          onChange={() => setDraftField("brand", undefined)}
                        />
                        <span>All brands</span>
                      </label>
                      {brands.map((brand) => (
                        <label className="product-filter-option" key={brand}>
                          <input
                            type="radio"
                            name="product-filter-brand"
                            checked={draft.brand === brand}
                            onChange={() => setDraftField("brand", brand)}
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <footer className="product-filter-drawer__footer">
                <button
                  type="button"
                  className="product-filter-drawer__clear"
                  disabled={getFilterCount(draft) === 0}
                  onClick={clearFilters}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="product-filter-drawer__apply"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </footer>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProductFilterDrawer;
