import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateGlobal } from "../../Global/GlobalSlice";
import { setPost, setLoading, setError } from "../SinglePostSlice";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";

const BlogEditForm = () => {
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.SinglePostSlice) || {};
  const [allCategories, setAllCategories] = useState([]);
  const [allWebsites, setAllWebsites] = useState([]);
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isLoading, setIsLoading] = useState(false);

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const [data, setData] = useState({
    title: "",
    slug: "",
    category: "",
    status: "draft",
   
    allowComments: false,
    websites: [],
    metaTitle: "",
    metaDescription: "",
    focusKeywords: []
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/blogs/post/${postId}`);
        const post = response.data;
        
        dispatch(setPost(post));
        setContent(post.content || "");
        setData({
          title: post.name || "",
          slug: post.slug || "",
          category: post.category?._id || "",
          status: post.status || "draft",
        
          allowComments: post.comments || false,
          websites: post.websites?.map(w => w._id) || [],
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          focusKeywords: post.focusKeywords || []
        });
      } catch (error) {
        console.error("Failed to fetch post:", error);
        dispatch(setError(error.message));
        toast.error("Failed to fetch post data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const [categoriesRes, websitesRes] = await Promise.all([
          axiosInstance.get("/api/blogs/allCategories"),
          axiosInstance.get("/api/blogs/allWebsites")
        ]);
        setAllCategories(categoriesRes.data);
        setAllWebsites(websitesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch required data");
      }
    };

    fetchPost();
    fetchData();
  }, [postId, dispatch]);

  const [keyword, setKeyword] = useState("");
  
  const addKeyword = () => {
    if (keyword.trim()) {
      setData(prev => ({
        ...prev,
        focusKeywords: [...prev.focusKeywords, keyword.trim()]
      }));
      setKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setData(prev => ({
      ...prev,
      focusKeywords: prev.focusKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!data.title || !content || !data.category || !data.metaTitle || !data.metaDescription || data.websites.length === 0 || !data.slug) {
        toast.error("Please fill all required fields.");
        console.log(data);
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("slug", data.slug);
      formData.append("content", content);
      formData.append("category", data.category);
      formData.append("status", data.status);
     
      formData.append("comments", data.allowComments);
      formData.append("createdBy", userData._id);
      formData.append("metaTitle", data.metaTitle);
      formData.append("metaDescription", data.metaDescription);
      data.websites.forEach((websiteId, index) => {
        formData.append(`websites[${index}]`, websiteId);
      });
      formData.append("focusKeywords", JSON.stringify(data.focusKeywords));

      const response = await axiosInstance.put(
        `/api/blogs/updatePost/${postId}`,
        formData,
       
      );

      dispatch(setPost(response.data));
      dispatch(updateGlobal());
      toast.success("Blog updated successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("A post with this slug already exists!");
      } else {
        toast.error("Error while updating blog!");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: 500,
    }),
    []
  );

  const getSeoStatus = (length, type) => {
    if (type === 'title') {
      if (length === 0) return { text: 'Empty', color: 'text-gray-500' };
      if (length < 30) return { text: 'Too Short', color: 'text-red-500' };
      if (length < 50) return { text: 'Good', color: 'text-green-500' };
      if (length <= 60) return { text: 'Perfect', color: 'text-blue-500' };
      return { text: 'Too Long', color: 'text-red-500' };
    } else {
      if (length === 0) return { text: 'Empty', color: 'text-gray-500' };
      if (length < 120) return { text: 'Too Short', color: 'text-red-500' };
      if (length < 150) return { text: 'Good', color: 'text-green-500' };
      if (length <= 160) return { text: 'Perfect', color: 'text-blue-500' };
      return { text: 'Too Long', color: 'text-red-500' };
    }
  };

  const getCollectiveKeywordStats = (text, keywords) => {
    if (!text || !keywords.length) return null;
    
    const cleanText = text.toLowerCase().replace(/<[^>]*>/g, '');
    const metaDescription = data.metaDescription.toLowerCase();
    const title = data.title.toLowerCase();
    
    let totalScore = 0;
    let totalOccurrences = 0;
    let keywordsInTitle = 0;
    let keywordsInMeta = 0;
    let keywordStats = [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const contentCount = (cleanText.match(new RegExp(keywordLower, 'g')) || []).length;
      totalOccurrences += contentCount;
      
      if (title.includes(keywordLower)) keywordsInTitle++;
      if (metaDescription.includes(keywordLower)) keywordsInMeta++;
      
      keywordStats.push({
        keyword,
        count: contentCount
      });
    });
    
    // Calculate collective metrics
    const averageOccurrences = totalOccurrences / keywords.length;
    const titleCoverage = (keywordsInTitle / keywords.length) * 100;
    const metaCoverage = (keywordsInMeta / keywords.length) * 100;
    const totalDensity = ((totalOccurrences * keywords.join(' ').length) / cleanText.length) * 100;
    
    // Calculate overall score
    const contentScore = Math.min(40, (averageOccurrences * 10));
    const titleScore = Math.min(30, (titleCoverage * 0.3));
    const metaScore = Math.min(30, (metaCoverage * 0.3));
    totalScore = Math.round(contentScore + titleScore + metaScore);
    
    let status;
    if (totalScore < 30) status = { text: 'Poor', color: 'text-red-500', bg: 'bg-red-100' };
    else if (totalScore < 60) status = { text: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    else if (totalScore < 80) status = { text: 'Good', color: 'text-green-500', bg: 'bg-green-100' };
    else status = { text: 'Excellent', color: 'text-blue-500', bg: 'bg-blue-100' };
    
    return {
      totalScore,
      averageOccurrences,
      totalOccurrences,
      titleCoverage,
      metaCoverage,
      totalDensity: totalDensity.toFixed(1),
      keywordsInTitle,
      keywordsInMeta,
      status,
      keywordStats
    };
  };

  const [collectiveStats, setCollectiveStats] = useState(null);
  
  useEffect(() => {
    setCollectiveStats(getCollectiveKeywordStats(content, data.focusKeywords));
  }, [content, data.focusKeywords, data.title, data.metaDescription]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Blog</h3>
      
      {/* Collective Keyword Stats Board */}
      {collectiveStats && data.focusKeywords.length > 0 && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className={`${collectiveStats.status.bg} px-4 py-3 rounded-lg mb-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium text-gray-900">SEO Analysis</h4>
                <p className="text-sm text-gray-600">{data.focusKeywords.length} focus keywords</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${collectiveStats.status.color}`}>
                  {collectiveStats.totalScore}%
                </div>
                <div className={`text-sm font-medium ${collectiveStats.status.color}`}>
                  {collectiveStats.status.text}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Stats */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-medium text-gray-800 mb-3">Content Coverage</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Occurrences:</span>
                  <span className="font-medium">{collectiveStats.totalOccurrences}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per Keyword:</span>
                  <span className="font-medium">{collectiveStats.averageOccurrences.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Density:</span>
                  <span className="font-medium">{collectiveStats.totalDensity}%</span>
                </div>
              </div>
            </div>

            {/* Title & Meta Stats */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-medium text-gray-800 mb-3">Title & Meta Coverage</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Keywords in Title:</span>
                  <span className="font-medium">{collectiveStats.keywordsInTitle} of {data.focusKeywords.length} ({Math.round(collectiveStats.titleCoverage)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Keywords in Meta:</span>
                  <span className="font-medium">{collectiveStats.keywordsInMeta} of {data.focusKeywords.length} ({Math.round(collectiveStats.metaCoverage)}%)</span>
                </div>
              </div>
            </div>

            {/* Individual Keyword Breakdown */}
            <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-medium text-gray-800 mb-3">Keyword Breakdown</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
                {collectiveStats.keywordStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-700 font-medium truncate mr-2">{stat.keyword}</span>
                    <span className="text-gray-600">{stat.count} times</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Title *
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={data.title}
              onChange={(e) =>
                setData({
                  ...data,
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Slug * <span className="text-sm text-gray-500">(Auto-generated, but you can edit)</span>
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="your-blog-post-slug"
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: generateSlug(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Category *
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {allCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Status *
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
              required
            >
              <option value="">Select Status</option>
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Meta Title *
            </label>
            <input
              type="text"
              maxLength={60}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter meta title"
              value={data.metaTitle}
              onChange={(e) =>
                setData({ ...data, metaTitle: e.target.value })
              }
            />
            <small className="flex items-center gap-2">
              <span className="text-gray-500">{data.metaTitle.length}/60 characters</span>
              <span className={`${getSeoStatus(data.metaTitle.length, 'title').color} font-medium`}>
                ({getSeoStatus(data.metaTitle.length, 'title').text})
              </span>
            </small>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Meta Description *
            </label>
            <textarea
              maxLength={160}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter meta description"
              value={data.metaDescription}
              onChange={(e) =>
                setData({ ...data, metaDescription: e.target.value })
              }
            />
            <small className="flex items-center gap-2">
              <span className="text-gray-500">{data.metaDescription.length}/160 characters</span>
              <span className={`${getSeoStatus(data.metaDescription.length, 'description').color} font-medium`}>
                ({getSeoStatus(data.metaDescription.length, 'description').text})
              </span>
            </small>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Websites *
            </label>
            <select
              multiple
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={data.websites}
              onChange={(e) =>
                setData({
                  ...data,
                  websites: Array.from(e.target.selectedOptions, option => option.value)
                })
              }
            >
              {allWebsites.map((website) => (
                <option key={website._id} value={website._id} defaultChecked={data.websites.includes(website._id)}>
                  {website.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Focus Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter a focus keyword and press Enter or Add"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={addKeyword}
                className="bg-blue-500 text-white rounded-lg px-4 whitespace-nowrap"
              >
                Add Keyword
              </button>
            </div>
            
            {data.focusKeywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.focusKeywords.map((kw, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Content *
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>

         
          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              id="allowComments"
              checked={data.allowComments}
              onChange={(e) =>
                setData({ ...data, allowComments: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="allowComments"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Allow Comments
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditForm;
