import React, { useState } from "react";
import { useGetFaqsQuery } from "../../../redux/services/support";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faqs = () => {
  const { data: groupedFaqs, isLoading, error } = useGetFaqsQuery();

  const [openFaqs, setOpenFaqs] = useState({});

  const toggleFaq = (categoryId, faqId) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [faqId]: !prev[categoryId]?.[faqId],
      },
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading FAQs.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div>
        {groupedFaqs?.data?.map((categoryGroup) => (
          <div key={categoryGroup.category._id} className="mb-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              {categoryGroup.category.title}
            </h3>
            {categoryGroup.faqs.map((faq) => (
              <div key={faq._id} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq(categoryGroup.category._id, faq._id)}
                >
                  <h4 className="font-bold">{faq.question}</h4>
                  {openFaqs[categoryGroup.category._id]?.[faq._id] ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </div>
                {openFaqs[categoryGroup.category._id]?.[faq._id] && (
                  <p className="mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
